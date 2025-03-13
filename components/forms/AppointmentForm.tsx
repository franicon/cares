"use client"

import {z} from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form,} from "@/components/ui/form"
import {SubmitButton} from "@/components/SubmitButton";
import {useState} from "react";
import {getAppointmentSchema} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {Doctors} from "@/constant";
import {SelectItem} from "@/components/ui/select";
import {CustomFormField} from "@/components/CustomFormField";
import Image from "next/image";
import {FormFiledTypes} from "@/components/forms/PatientForm";
import {createAppointment} from "@/lib/actions/appointment.actions";
import {Status} from "@/types";

type AppointmentFormProps = {
    userId: string,
    patientId: string,
    type: "create" | "cancel" | "schedule"
}


const AppointmentForm = ({userId, patientId, type}: AppointmentFormProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const AppointmentFormValidation = getAppointmentSchema(type)

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: "",
            note: "",
            cancellationReason: ""
        },
    })

    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true);

        let status;
        switch (type) {
            case 'schedule':
                status = 'scheduled';
                break;
            case 'cancel':
                status = 'cancelled';
                break;
            default:
                status = 'pending'
                break
        }

        try {
            if (type === 'create' && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    reason: values.reason,
                    schedule: new Date(values.schedule),
                    status: status as Status,
                    note: values.note,
                }
                const appointment = await createAppointment(appointmentData);
                if (appointment) {
                    form.reset()
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }

    let buttonLabel;

    switch (type) {
        case 'cancel':
            buttonLabel = 'Cancel Appointment';
            break;
        case 'create':
            buttonLabel = 'Create Appointment';
            break;
        case 'schedule':
            buttonLabel = 'Schedule Appointment';
            break
        default:
            break

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">New Appointment</h1>
                    <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
                </section>
                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            control={form.control}
                            fieldType={FormFiledTypes.SELECT}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="select doctor"
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

                        <CustomFormField
                            fieldType={FormFiledTypes.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Expected appointmentdate"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />

                        <div className="flex flex-col xl:flex-row gap-6">
                            <CustomFormField
                                fieldType={FormFiledTypes.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Reason for appointment"
                                placeholder="Enter reason for appointment"
                            />
                            <CustomFormField
                                fieldType={FormFiledTypes.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Notes"
                                placeholder="Enter notes"
                            />
                        </div>

                        {type === "cancel" && (
                            <CustomFormField
                                fieldType={FormFiledTypes.TEXTAREA}
                                control={form.control}
                                name="cancellationReason"
                                label="Reason for cancellation"
                                placeholder="Enter reason for cancellation"
                            />
                        )}
                    </>
                )}

                <SubmitButton isLoading={isLoading}
                              className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm