const colors = {
  expired: {
    color: "text-gray-600 dark:text-gray-300",
    bgColor: "bg-gray-50 dark:bg-gray-500",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  today: {
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900",
    borderColor: "border-orange-200 dark:border-orange-700",
  },
  soon: {
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900",
    borderColor: "border-yellow-200 dark:border-yellow-700",
  },
  upcoming: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900",
    borderColor: "border-blue-200 dark:border-blue-700",
  },
};
export default colors

/*
[
    {
      title: 'Expired',
      count: expiredItems.length,
      icon: AlertTriangle,
      color: 'text-gray-600 dark:text-gray-300',
      bgColor: 'bg-gray-50 dark:bg-gray-500',
      borderColor: 'border-gray-200 dark:border-gray-700'
    },
    {
      title: 'Expires Today',
      count: todayItems.length,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900',
      borderColor: 'border-orange-200 dark:border-orange-700'
    },
    {
      title: 'Expires Soon (1-3 days)',
      count: soonItems.length,
      icon: Calendar,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900',
      borderColor: 'border-yellow-200 dark:border-yellow-700'
    },
    {
      title: 'Upcoming (4-7 days)',
      count: upcomingItems.length,
      icon: TrendingDown,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900',
      borderColor: 'border-blue-200 dark:border-blue-700'
    }
  ] */
