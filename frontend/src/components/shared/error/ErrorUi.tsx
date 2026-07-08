const ErrorUi = ({ error }: { error: any }) => {
  return (
    <div className="flex justify-center py-10">
      {"status" in error &&
      error?.data &&
      typeof error.data === "object" &&
      "errorMessage" in error.data ? (
        <p>{(error.data as { errorMessage: string }).errorMessage}</p>
      ) : (
        <p>Something went wrong.</p>
      )}
    </div>
  );
};

export default ErrorUi;