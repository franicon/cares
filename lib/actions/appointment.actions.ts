"use server";

import {APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases} from "@/lib/appwrite.config";
import {ID} from "node-appwrite";
import {parseStringify} from "@/lib/utils";
import {CreateAppointmentParams} from "@/types";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            `${DATABASE_ID}`,
            `${APPOINTMENT_COLLECTION_ID}`,
            ID.unique(),
            {
                ...appointment
            })
        return parseStringify(newAppointment)

    } catch (error: any) {
        console.log(error);
    }

}