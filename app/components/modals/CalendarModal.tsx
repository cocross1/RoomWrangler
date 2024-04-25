"use client";

import Modal from "./Modal";
import useCalendarModal from "@/app/hooks/useCalendar";
import Heading from "../Heading";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";

const CalendarModal = () => {
  const calendarModal = useCalendarModal();
  const reservations = calendarModal.reservations;
  const title = "Calendar For " + calendarModal.buildingAndNumber;

  // NEED TO FIX THIS
  let eventColorMap = new Map<string, string>([
    ["ET", "#378006"],
    ["AT", "#378006"],
    ["Academic Class", "#ffb3ba"],
    ["Club", "#ffffba"],
    ["Personal", "#bae1ff"],
  ]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title={title} />
      <div>
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek",
          }}
          slotMinTime="06:00:00" // Start time of the calendar view
          slotMaxTime="24:00:00" // End time of the calendar view
          events={reservations.map((reservation) => ({
            title: reservation.displayName,
            start: reservation.startTime,
            end: reservation.endTime,
            backgroundColor: eventColorMap.get(reservation.type) ?? "#d3d3d3",
            textColor: "#000000",
          }))}
          allDaySlot={false}
        />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={calendarModal.isOpen}
      onClose={calendarModal.onClose}
      onSubmit={() => {}}
      actionLabel=""
      title=""
      allowClose={true}
      body={bodyContent}
    />
  );
};

export default CalendarModal;
