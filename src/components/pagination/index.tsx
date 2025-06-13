import Image from "next/image";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <button
        key={1}
        type="button"
        className={`rounded-lg border border-beige-500 h-10 w-10 flex items-center justify-center cursor-pointer ${
          currentPage === 1 ? "bg-grey-900 text-white" : "bg-transparent"
        }`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    // Calculate middle pages
    let middlePages = [];
    
    if (currentPage <= 3) {
      // Near start: show 2, 3
      for (let i = 2; i <= 3; i++) {
        if (i < totalPages) {
          middlePages.push(i);
        }
      }
    } else if (currentPage >= totalPages - 2) {
      // Near end: show totalPages-2, totalPages-1
      for (let i = totalPages - 2; i <= totalPages - 1; i++) {
        if (i > 1) {
          middlePages.push(i);
        }
      }
    } else {
      // In middle: show currentPage-1, currentPage, currentPage+1
      middlePages = [currentPage - 1, currentPage, currentPage + 1];
    }

    // Add ellipsis after first page if needed
    if (middlePages[0] > 2) {
      pages.push(
        <button
          key="ellipsis-start"
          type="button"
          className="rounded-lg border border-beige-500 h-10 w-10 items-center justify-center bg-transparent cursor-default"
          disabled
        >
          ...
        </button>
      );
    }

    // Add middle pages
    middlePages.forEach(pageNum => {
      pages.push(
        <button
          key={pageNum}
          type="button"
          className={`rounded-lg border border-beige-500 h-10 w-10 flex items-center justify-center cursor-pointer ${
            currentPage === pageNum ? "bg-grey-900 text-white" : "bg-transparent"
          }`}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      );
    });

    // Add ellipsis before last page if needed
    if (middlePages[middlePages.length - 1] < totalPages - 1) {
      pages.push(
        <button
          key="ellipsis-end"
          type="button"
          className="rounded-lg border border-beige-500 h-10 w-10 flex items-center justify-center bg-transparent cursor-default"
          disabled
        >
          ...
        </button>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          type="button"
          className={`rounded-lg border border-beige-500 h-10 w-10 flex items-center justify-center cursor-pointer ${
            currentPage === totalPages ? "bg-grey-900 text-white" : "bg-transparent"
          }`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between gap-4 md:gap-0">
      <div>
        <button
          type="button"
          className={`rounded-lg bg-transparent border border-beige-500 min-h-10 min-w-10 md:px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Image
            src="/icons/left-chevron.svg"
            alt="left-chevron"
            width={20}
            height={20}
          />
          <span className="text-sm hidden md:block">Prev</span>
        </button>
      </div>
      <div className="flex gap-2">
        {renderPageNumbers()}
      </div>
      <div>
        <button
          type="button"
          className={`rounded-lg bg-transparent border border-beige-500 min-h-10 min-w-10 md:px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <span className="text-sm hidden md:block">Next</span>
          <Image
            src="/icons/right-chevron.svg"
            alt="right-chevron"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}