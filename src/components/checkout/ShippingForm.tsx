"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";

interface ShippingFormProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  formErrors: Record<string, string>;
  deliveryArea: "inside" | "outside" | null;
  insideDhakaCharge?: number;
  outsideDhakaCharge?: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeliveryAreaChange: (area: "inside" | "outside") => void;
}

export default function ShippingForm({ formData, formErrors, deliveryArea, insideDhakaCharge = 80, outsideDhakaCharge = 100, onInputChange, onDeliveryAreaChange }: ShippingFormProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  
  return (
    <>
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
          <Truck className="w-4 h-4 text-gray-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Customer Information
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="fullName"
            value={formData.fullName}
            onChange={onInputChange}
            className={`mt-1 ${formErrors.fullName ? "border-red-500" : ""}`}
            placeholder="Enter your full name"
          />
          {formErrors.fullName && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.fullName}
            </p>
          )}
        </div>
        {currentUser && (
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              required
              id="email"
              type="email"
              value={formData.email || currentUser.email}
              onChange={onInputChange}
              className={`mt-1 ${formErrors.email ? "border-red-500" : ""}`}
              placeholder={currentUser.email}
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-500">
                {formErrors.email}
              </p>
            )}
          </div>
        )}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={onInputChange}
            className={`mt-1 ${formErrors.phone ? "border-red-500" : ""}`}
          />
          {formErrors.phone && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.phone}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="address" className="text-sm font-medium">
            Address <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="address"
            value={formData.address}
            onChange={onInputChange}
            className={`mt-1 ${formErrors.address ? "border-red-500" : ""}`}
            placeholder="Enter your full address"
          />
          {formErrors.address && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.address}
            </p>
          )}
        </div>
      </div>
        
        {/* Delivery Area Selection */}
        <div className="border-t pt-5 mt-5">
          <Label className="text-sm font-medium mb-3 block">
            Delivery Area <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <label className={`flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 ${deliveryArea === "inside" ? "border-green-500 bg-green-50" : ""}`}>
              <div className="relative">
                <input
                  type="radio"
                  name="deliveryArea"
                  value="inside"
                  checked={deliveryArea === "inside"}
                  onChange={(e) => onDeliveryAreaChange(e.target.value as "inside" | "outside")}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 ${deliveryArea === "inside" ? "border-green-600 bg-green-600" : "border-gray-300 bg-white"} flex items-center justify-center`}>
                  {deliveryArea === "inside" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Inside Dhaka</span>
                <p className="text-xs text-gray-500">Delivery charge: ৳{insideDhakaCharge}</p>
              </div>
            </label>
            <label className={`flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 ${deliveryArea === "outside" ? "border-green-500 bg-green-50" : ""}`}>
              <div className="relative">
                <input
                  type="radio"
                  name="deliveryArea"
                  value="outside"
                  checked={deliveryArea === "outside"}
                  onChange={(e) => onDeliveryAreaChange(e.target.value as "inside" | "outside")}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 ${deliveryArea === "outside" ? "border-green-600 bg-green-600" : "border-gray-300 bg-white"} flex items-center justify-center`}>
                  {deliveryArea === "outside" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Outside Dhaka</span>
                <p className="text-xs text-gray-500">Delivery charge: ৳{outsideDhakaCharge}</p>
              </div>
            </label>
          </div>
          {formErrors.deliveryArea && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.deliveryArea}
            </p>
          )}
        </div>
    </>
  );
}