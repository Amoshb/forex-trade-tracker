export default function ChartStateWrapper({
  title,
  isLoading,
  isError,
  error,
  children,
}) {
  if (isLoading) {
    return (
      <div className="user-homepage-chart-card">
        <h2 className="user-homepage-chart-card__title">{title}</h2>

        <p className="user-homepage-chart-card__message">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="user-homepage-chart-card">
        <h2 className="user-homepage-chart-card__title">{title}</h2>

        <p className="user-homepage-chart-card__message user-homepage-chart-card__message--error">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"}
        </p>
      </div>
    );
  }

  return children;
}
