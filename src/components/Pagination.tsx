import { useNavigate } from "react-router-dom";

export const Pagination = ({
  totalPages,
  pageNumber,
}: {
  totalPages: number;
  pageNumber: number;
}) => {
  const navigate = useNavigate();

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    navigate(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={pageNumber <= 1}
        onClick={() => changePage(pageNumber - 1)}
        className="py-2 px-2 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              className={`px-2 rounded-sm ${
                pageNumber === pageIndex ? "bg-slate-200" : ""
              }`}
              onClick={() => {
                changePage(pageIndex);
              }}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>
      <button
        disabled={pageNumber >= totalPages}
        onClick={() => changePage(pageNumber + 1)}
        className="py-2 px-2 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};
