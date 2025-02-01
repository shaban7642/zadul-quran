import { useCallback, useEffect, useRef, useState } from "react";
import { Box, useMediaQuery, Drawer } from "@mui/material";
import { Theme } from "@mui/material/styles";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { useMounted } from "../../hooks/use-mounted";
import { sessionApi } from "../../api/sessionsApi";
import { SessionListFilters } from "./sessions-list-filters";
import { useAuth } from "../../hooks/use-auth";
import moment from "moment";
import { SessionForm } from "./sessions-form";

export const sessionMethods = [{ value: "zoom", label: "zoom" }];
const CreateSession = () => {
  const initialFilters: any = {
    date: {
      from: null,
      to: null,
    },
    teacherId: null,
    departmentId: null,
    studentId: null,
  };
  const isMounted = useMounted();
  const { user } = useAuth();
  const calendar = useRef(null);

  const [currentEvents, setCurrentEvents] = useState([]);

  const [sessions, setSessions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState<any>({});
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"), {
    noSsr: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [openFilters, setOpenFilters] = useState<boolean>(mdUp);

  const handleOpen = () => {
    setOpen(true);
  };

  const getSessions = useCallback(
    async (filterObject: any) => {
      try {
        const data: any = await sessionApi.getSessions({
          ...filterObject,
          ...filters,
        });
        if (isMounted()) {
          setSessions(
            data.rows.map((ra: any) => ({
              title: ra.title || "No name",
              start: `${ra?.date.substr(0, 11)}${moment(
                `${ra?.date.substr(0, 11)}${ra.startTime}${ra.date.substr(
                  19,
                  24
                )}`
              ).format("HH:mm")}`,
              end: `${ra?.date.substr(0, 11)}${moment(
                `${ra.endTime}${ra.date.substr(19, 24)}`
              ).format("HH:mm")}`,
            }))
          );
        }
      } catch (err: any) {
        console.log(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted]
  );

  useEffect(() => {
    getSessions({ limit: "ALL", offset: -1 });
  }, []);

  const createSession = async (values: any): Promise<{ success: boolean }> => {
    const load = toast.loading("create");
    try {
      const resp = await sessionApi.createSession(values);
      if (resp) {
        toast.dismiss(load);
        toast.success("createSessionSuccess");
        getSessions({ limit: "ALL", offset: -1 });
        return { success: true };
      } else {
        toast.dismiss(load);
        toast.error("createSessionFailed");
        return { success: false };
      }
    } catch (err: any) {
      toast.dismiss(load);
      toast.error(err.message || "createSessionsFailed");
      return { success: false };
    }
  };


  const handleDateSelect = (selectInfo: any) => {
    // let title = prompt('Please enter a new title for your event');
    // let calendarApi = selectInfo.view.calendar;
    // calendarApi.unselect(); // clear date selection
    // if (title) {
    //     calendarApi.addEvent({
    //         id: String(counter++),
    //         title,
    //         start: selectInfo.startStr,
    //         end: selectInfo.endStr,
    //         allDay: selectInfo.allDay,
    //     });
    // }
  };

  const handleEventClick = (clickInfo: any) => {
    // if (
    //     confirm(
    //         `Are you sure you want to delete the event '${clickInfo.event.title}'`
    //     )
    // ) {
    //     clickInfo.event.remove();
    // }
  };

  const handleEvents = (events: any) => {
    setCurrentEvents(events);
  };

  const applyFilters = (filters: any): any => {
    setFilters(filters);
    getSessions({ limit: "ALL", offset: -1, ...filters });
  };

  const clearFilters = () => {
    setLoading(true);
    applyFilters(initialFilters);
  };

  const handleToggleFilters = (): void => {
    setOpenFilters((prevState) => !prevState);
  };

  const handleCloseFilters = (): void => {
    setOpenFilters(false);
  };


  return (
    <Box sx={{ margin: 1, display: "flex", width: "100%" }}>
      {["super_admin", "admin"].includes(user?.role?.name) && (
        <>
          {mdUp ? (
            <Box sx={{ width: openFilters ? "20%" : "0%" }}>
              <SessionListFilters
                containerRef={rootRef}
                onClose={handleCloseFilters}
                open={openFilters}
                applyFilters={(filters: any): Promise<void> =>
                  applyFilters(filters)
                }
                clearFilters={clearFilters}
                isCreatePage={true}
              />
            </Box>
          ) : (
            <Drawer
              open={openFilters}
              PaperProps={{
                sx: {
                  width: 280,
                },
              }}
              onClose={() => {
                setOpenFilters(false);
              }}
            >
              <SessionListFilters
                containerRef={rootRef}
                onClose={handleCloseFilters}
                open={openFilters}
                applyFilters={(filters: any): Promise<void> =>
                  applyFilters(filters)
                }
                clearFilters={clearFilters}
                isCreatePage={true}
              />
            </Drawer>
          )}
        </>
      )}
      <Box
        sx={{
          // width: openFilters
          //     ? 'calc(100% - 380px)'
          //     : 'calc(100% + 380px)',
          m: "auto",
          width: openFilters ? "80%" : "120%",
          "& .fc .fc-toolbar": {
            flexDirection: mdUp ? "row" : "column",
          },
        }}
      >
        <FullCalendar
          ref={calendar}
          expandRows={true}
          contentHeight={750}
          headerToolbar={{
            start: "prev,next today filterButton",
            center: "title",
            end: "addEventButton,multiMonthYear,listWeek,dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
            multiMonthPlugin,
          ]}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short", // Enables AM/PM
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short", // Ensures AM/PM format for events
          }}
          // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          // eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire: */
          eventAdd={function () {}}
          eventChange={function () {}}
          eventRemove={function () {}}
          events={sessions}
          customButtons={{
            ...((user?.role?.name === "admin" ||
              user?.role?.name === "super_admin") && {
              addEventButton: {
                text: "add event",
                click: function (selectInfo, ev) {
                  handleOpen();
                },
              },
              filterButton: {
                text: "Filter",
                click: function (selectInfo, ev) {
                  handleToggleFilters();
                },
              },
            }),
          }}
        />
      </Box>
      {/* <div className='demo-app-sidebar-section'>
                <h2>All Events ({currentEvents.length})</h2>
                <ul>{currentEvents.map(renderSidebarEvent)}</ul>
            </div> */}
      <SessionForm
        open={open}
        setOpen={setOpen}
        createSession={createSession}
      />
    </Box>
  );
};

export default CreateSession;
