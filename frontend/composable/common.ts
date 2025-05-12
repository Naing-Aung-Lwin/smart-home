export default function Common() {
  const getDayAndCurrentTime = (dateString: string) => {
    const inputDate = new Date(dateString);

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayOfWeek = weekdays[inputDate.getDay()];

    return dayOfWeek;
  };

  return {
    getDayAndCurrentTime,
  };
}
