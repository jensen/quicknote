const NoteBodySkeleton = () => (
  <div className="w-full flex justify-center px-8">
    <div className="h-full border border-gray-300 shadow rounded-md p-2 w-full">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-400 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-400 rounded"></div>
            <div className="h-4 bg-gray-400 rounded w-5/6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-400 rounded"></div>
            <div className="h-4 bg-gray-400 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-gray-400 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-400 rounded w-5/6"></div>
            <div className="h-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NoteBodySkeleton;
