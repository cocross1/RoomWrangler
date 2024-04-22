"use client";

import React, { useMemo, useState } from "react";
import { parseISO, formatISO } from 'date-fns';
import Modal from "./Modal";
import useCalendarModal from "@/app/hooks/useCalendar";
import Heading from "../Heading";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid'


const CalendarModal = () => {

  const calendarModal = useCalendarModal();
  const reservations = calendarModal.reservations;
  //const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const title = "Calendar For " + calendarModal.buildingAndNumber;

  

 
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title={title} />
      <div>
      <FullCalendar
    plugins={[timeGridPlugin, dayGridPlugin]}
    initialView="timeGridWeek" // Or "timeGridDay" for daily view
    headerToolbar={{
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek'
    }}
    slotMinTime="06:00:00" // Start time of the calendar view
    slotMaxTime="24:00:00" // End time of the calendar view
    events={reservations.map(reservation => ({
      title: reservation.displayName, 
      start: reservation.startTime,
      end: reservation.endTime
    }))}
    eventColor="#378006" // Customize event colors as needed
    allDaySlot={false} // Disable the all-day slot row at the top
  />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={calendarModal.isOpen}
      onClose={calendarModal.onClose}
      onSubmit={()=>{}}
      actionLabel=""
      title=""
      allowClose={true}
      body={bodyContent}
    />
  );
};

export default CalendarModal;
