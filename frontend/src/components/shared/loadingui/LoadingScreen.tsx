function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />

        {/* Skeleton text */}
        <div className="space-y-2">
          <div className="h-2 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-2 w-28 bg-gray-200 rounded animate-pulse" />
        </div>

        <p className="text-sm text-gray-500">Please wait we are loading your page...</p>
      </div>
    </div>
  );
}
export default LoadingScreen;