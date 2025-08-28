
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      <p className="ml-4 text-xl">Loading...</p>
    </div>
  );
}
