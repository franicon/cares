"use client"

import {z} from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl,} from "@/components/ui/form"
import {CustomFormField} from "@/components/CustomFormField";
import {SubmitButton} from "@/components/SubmitButton";
import {useState} from "react";
import {UserFormValidation} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {createUser} from "@/lib/actions/patient.actions";
import {FormFiledTypes} from "@/components/forms/PatientForm";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {GenderOption} from "@/constant";
import {Label} from "@/components/ui/label";


const RegisterForm = ({user}: { user: User }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: ""
        },
    })

    async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
        setIsLoading(true);

        try {
            const userData = {name, email, phone}

            const user = await createUser(userData);

            if (user) router.push(`/patients/${user.$id}/register`)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself</p>
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </section>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.INPUT}
                    name="name"
                    label="name"
                    placeholder="Bayonle Oreofe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                <div className="flex flex-col gap-6 xl:flex-row">
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
                        label="Phone number"
                        placeholder="(234) 8062522905"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.DATE_PICKER}
                        name="birthDate"
                        label="Date of Birth"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.SKELETON}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    {GenderOption.map((option) => (
                                        <div key={option} className="radio-group">
                                            <RadioGroupItem value={option} id={option}/>
                                            <Label className="cursor-pointer" htmlFor={option}>{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )
                        }
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.INPUT}
                        name="address"
                        label="Address"
                        placeholder="14, street, new york"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.INPUT}
                        name="ocupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.INPUT}
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        placeholder="Guardian's name"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.PHONE_INPUT}
                        name="emergencyContactNumber"
                        label="Emergency Contact Number"
                        placeholder="(234) 8062522905"
                    />
                </div>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.SELECT}
                    name="primaryPhysician"
                    label="Primary Physician"
                    placeholder="select a physician"
                />
                <div className="flex flex-col gap-6 xl:flex-row"></div>
                <div className="flex flex-col gap-6 xl:flex-row"></div>
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm