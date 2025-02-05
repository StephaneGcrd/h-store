import {useState, useEffect, useRef} from 'react';
import {CloseIcon, SearchIcon} from '../icons';
import {Image} from '@shopify/hydrogen';
import {Link} from '../Link';
import {useRouteLoaderData} from '@remix-run/react';

type SearchResultResponse = {
  seo: Seo;
  searchTerm: string;
  products: Products;
};

type Seo = {
  title: string;
  description: string;
  titleTemplate: string;
  url: string;
  media: {
    type: string;
  };
  jsonLd: Array<JsonLd>;
};

type JsonLd = {
  '@context': string;
  '@type': string;
  itemListElement?: Array<ItemListElement>;
  name?: string;
  description?: string;
  url?: string;
  mainEntity?: MainEntity;
};

type ItemListElement = {
  '@type': string;
  position: number;
  name: string;
  item?: string;
  url?: string;
};

type MainEntity = {
  '@type': string;
  itemListElement: Array<ItemListElement>;
};

type Products = {
  nodes: Array<ProductNode>;
  pageInfo: PageInfo;
};

type ProductNode = {
  id: string;
  title: string;
  publishedAt: string;
  handle: string;
  vendor: string;
  variants: {
    nodes: Array<VariantNode>;
  };
  featuredImage: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  };
};

type VariantNode = {
  id: string;
  availableForSale: boolean;
  image: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  };
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: string | null;
  selectedOptions: Array<SelectedOption>;
  product: {
    handle: string;
    title: string;
  };
};

type SelectedOption = {
  name: string;
  value: string;
};

type PageInfo = {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Results = ({
  results,
  onClose,
}: {
  results: SearchResultResponse | null;
  onClose: () => void;
}) => {
  const {i18nData} = useRouteLoaderData('root');

  if (!results || results.products.nodes.length === 0) {
    return <></>;
    //return <div>{i18nData.search.placeholder}</div>;
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 px-4">
      {results.products.nodes.map((product) =>
        product?.hidden?.value === 'true' ? (
          <></>
        ) : (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className=""
            onClick={onClose}
          >
            <div className="w-full h-48 bg-slate-100">
              <Image
                data={product.featuredImage}
                className="w-full object-cover h-full"
              />
            </div>
            <div className="text-xs text-start w-full">{product.title}</div>
          </Link>
        ),
      )}
    </div>
  );
};

const SearchDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResultResponse | null>(null);
  const {i18nData} = useRouteLoaderData('root');
  const inputRef = useRef<HTMLInputElement>(null);

  // Refs for tracking touch coordinates
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // When the drawer is closed, defocus the input.
  useEffect(() => {
    if (!isOpen && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/search?q=${query || 'a'}`);
      const data = (await response.json()) as SearchResultResponse;
      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const debouncedSearch = debounce(handleSearch, 300);

  useEffect(() => {
    if (query) {
      debouncedSearch();
    }
  }, [query]);

  // Helper function to close the drawer and defocus the input.
  const handleClose = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    onClose();
  };

  // Touch event handlers for swipe-to-close functionality
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchCurrentXRef.current = touch.clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null) {
      const deltaX = touchCurrentXRef.current - touchStartXRef.current;
      // If the user swiped more than 50px from left to right, trigger handleClose.
      if (deltaX > 50) {
        handleClose();
      }
    }
    // Reset touch values.
    touchStartXRef.current = null;
    touchCurrentXRef.current = 0;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } w-full sm:w-[375px]`}
    >
      <div className="sticky top-0 bg-white z-10 p-4">
        <div className="t2 pb-2">Search</div>
        <button onClick={handleClose} className="absolute top-4 right-4">
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
          <input
            type="text"
            placeholder={i18nData.search.placeholder}
            className="w-full bg-slate-100 border-none pl-10 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
          />
          {query && (
            <CloseIcon
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-4 h-4"
              onClick={() => setQuery('')}
            />
          )}
        </div>
      </div>
      <Results results={results} onClose={handleClose} />
    </div>
  );
};

export default SearchDrawer;
