import moment from "moment";

export const convertTo12HourFormat = (time: String) => {
  // Split the time into hours and minutes
  let [hours, minutes] = time.split(":");
  let h;
  // Convert the hours to a number
  h = parseInt(hours, 10);

  // Determine the suffix (AM/PM)
  let suffix = h >= 12 ? "PM" : "AM";

  // Convert the hours to 12-hour format
  h = ((h + 11) % 12) + 1;

  // Return the formatted time
  return `${h}:${minutes} ${suffix}`;
};
