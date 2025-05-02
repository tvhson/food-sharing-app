import getDistance from 'geolib/es/getDistance';

export function timeAgo(dateInput: Date | string | number) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error('date must be a valid Date, string, or number');
  }
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    if (diffInSeconds < 0) {
      return 'Vừa xong';
    }
    return `${diffInSeconds} giây trước`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  if (diffInDays < 30) {
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} tuần trước`;
  }

  if (diffInDays < 365) {
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
}

export const calculateExpiredDate = (expiredDate: Date) => {
  const now = new Date();
  const diff = expiredDate.getTime() - now.getTime();

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  if (years > 0) {
    return `${years} năm`;
  }

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  if (months > 0) {
    return `${months} tháng`;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) {
    return `${days} ngày`;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) {
    return `${hours} tiếng`;
  }

  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) {
    return `${minutes} phút`;
  }

  return 'Hết hạn';
};
export const calculateDistance = (
  item: {
    latitude: number;
    longitude: number;
  },
  location: {latitude: number; longitude: number},
) => {
  if (location && location.latitude && location.longitude) {
    return (
      getDistance(
        {latitude: item.latitude, longitude: item.longitude},
        {latitude: location.latitude, longitude: location.longitude},
      ) / 1000
    );
  }
  return 0;
};
