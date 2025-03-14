"use client"

import {z} from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl,} from "@/components/ui/form"
import {CustomFormField} from "@/components/CustomFormField";
import {SubmitButton} from "@/components/SubmitButton";
import {useState} from "react";
import {PatientFormValidation} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {FormFiledTypes} from "@/components/forms/PatientForm";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues} from "@/constant";
import {Label} from "@/components/ui/label";
import {SelectItem} from "@/components/ui/select";
import Image from "next/image";
import {FileUploader} from "@/components/FileUploader";
import {registerPatient} from "@/lib/actions/patient.actions";
import {Models} from "node-appwrite";
import User = Models.User;


const RegisterForm = ({user}: { user: User }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: ""
        },
    })

    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);
        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {type: values.identificationDocument[0].type});

            formData = new FormData();
            formData.append('blobFile', blobFile);
            formData.append('fileName', values.identificationDocument[0].name);
        }
        console.log(user.$id)

        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData
            }
            const patient = await registerPatient(patientData);
            if (patient) router.push(`/patients/${user.$id}/new-appointment`)

        } catch (error) {
            console.log(error)
        }

        setIsLoading(false);

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
                                    {GenderOptions.map((option) => (
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
                        name="occupation"
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
                >{Doctors.map((doctor) => (
                    <SelectItem key={doctor.name} value={doctor.name}>
                        <div className="flex cursor-pointer items-center gap-2">
                            <Image
                                src={doctor.image}
                                height={32}
                                width={32}
                                alt={doctor.name}
                                className="rounded-full border border-dark-500"
                            />
                            <p>{doctor.name}</p>
                        </div>
                    </SelectItem>
                ))}</CustomFormField>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.INPUT}
                        name="insuranceProvider"
                        label="Insurance provider"
                        placeholder="BlueCross BlueShield"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.INPUT}
                        name="insurancePolicyNumber"
                        label="Insurance policy number"
                        placeholder="123456789ABC"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.TEXTAREA}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="Peanuts, pollen, etc"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.TEXTAREA}
                        name="currentMedication"
                        label="Current Medication (if any)"
                        placeholder="Ibuprofen 200mg, etc"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.TEXTAREA}
                        name="familyMedicalHistory"
                        label="Family medical history"
                        placeholder="Mother has headaches, etc"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFiledTypes.TEXTAREA}
                        name="pastMedicalHistory"
                        label="Past medical history"
                        placeholder="Appendectomy, etc"
                    />
                </div>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </section>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.SELECT}
                    name="identificationType"
                    label="Identification type"
                    placeholder="select a identification type"
                >{IdentificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                        {type}
                    </SelectItem>
                ))}</CustomFormField>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.INPUT}
                    name="identificationNumber"
                    label="Identification number"
                    placeholder="123456789"
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.SKELETON}
                    name="identificationDocument"
                    label="Scanned copy of identification document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange}/>
                        </FormControl>
                    )
                    }
                />
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.CHECKBOX}
                    name="treatmentConsent"
                    label="I consent to treatment"
                />

                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.CHECKBOX}
                    name="disclosureConsent"
                    label="I consent to disclosure of information"
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFiledTypes.CHECKBOX}
                    name="privacyConsent"
                    label="I consent to privacy policy"
                />


                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm