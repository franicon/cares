"use client"

import {z} from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form,} from "@/components/ui/form"
import {CustomFormField} from "@/components/CustomFormField";
import {SubmitButton} from "@/components/SubmitButton";
import {useState} from "react";
import {UserFormValidation} from "@/lib/validation";

export enum FormFiledTypes {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}


const PatientForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: " ",
            phone: " "
        },
    })

    function onSubmit(values: z.infer<typeof UserFormValidation>) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi there 👋</h1>
                    <p className="text-dark-700">Schedule your first appointment.</p>
                </section>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.INPUT}
                    name="name"
                    label="Full name"
                    placeholder="Bayonle Oreofe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.INPUT}
                    name="email"
                    label="Email"
                    placeholder="ore234@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.PHONE_INPUT}
                    name="phone"
                    label="Phone Number"
                    placeholder="(234) 8062522905"
                />
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm