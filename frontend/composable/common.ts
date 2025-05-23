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

  function formatDate(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
  }

  return {
    getDayAndCurrentTime,
    formatDate,
  };
}
