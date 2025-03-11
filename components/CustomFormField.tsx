'use client'

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Control} from "react-hook-form";
import {FormFiledTypes} from "@/components/forms/PatientForm";
import React from "react";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {E164Number} from "libphonenumber-js";

interface CustomProps {
    control: Control<any>
    fieldType: FormFiledTypes
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: string,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({field, props}: { field: any; props: CustomProps }) => {
    const {fieldType, iconSrc, iconAlt, placeholder} = props
    switch (fieldType) {
        case FormFiledTypes.INPUT:
            return (<div className="flex rounded-md border border-dark-500 bg-dark-400">
                {props.iconSrc && (<Image
                    src={iconSrc}
                    alt={iconAlt || 'ICON'}
                    height={24}
                    width={24} className="ml-2"
                />)}
                <FormControl>
                    <Input
                        placeholder={placeholder}
                        {...field} className="shad-input border-0"
                    />
                </FormControl>
            </div>)
        case FormFiledTypes.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry="NG"
                        placeholder={placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number}
                        onChange={field.onChange}
                        className="input-phone"
                    />
                </FormControl>
            )
        default:
            break;
    }
}

export const CustomFormField = (props: CustomProps) => {
    const {control, fieldType, name, label} = props
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({field}) => (
                    <FormItem className="flex-1">
                        {fieldType !== FormFiledTypes.CHECKBOX && label && (<FormLabel>{label}</FormLabel>)}
                        <RenderField field={field} props={props}/>
                        <FormMessage className="shad-error"/>
                    </FormItem>
                )}
            /></>
    );
};