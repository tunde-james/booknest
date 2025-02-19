import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useBookStore } from '../store/book-store';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchBooks, books } = useBookStore();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
      const searchQuery = urlParams.toString();
      searchBooks(searchQuery);
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchBooks]);

  console.log('Search Result: ', books);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    await searchBooks(searchQuery);

    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="min-h-screen text-[#252422] bg-[#f5f5f5] px-4 md:px-12 pb-10">
      <button onClick={() => navigate('/')} className="cursor-pointer py-3">
        &larr; Back
      </button>

      <div className="w-full h-full flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-sm md:max-w-xl lg:max-w-3xl text-base lg:text-lg"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. Half of a Yellow Sun"
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-[#fffcf2] border border-gray-500"
          />

          <button
            type="submit"
            className="absolute right-0 top-0 text-[#f5f5f5] bottom-0 bg-[#403d39] px-4 border border-white rounded-r-lg"
          >
            Search
          </button>
        </form>
      </div>

      <h1 className="font-semibold pt-8 pb-6 text-xl md:text-2xl">
        Search results
      </h1>

      {books.length > 0 ? (
        <div className="flex flex-wrap justify-around space-x-2 gap-y-5 lg:gap-y-8 w-full max-w-6xl mx-auto">
          {books.map((book, index) => (
            <Link key={index} to={`/book/${book._id}`} className="block">
              <div className="cursor-pointer w-36 md:w-40 xl:w-44 shadow-sm hover:shadow-md rounded-b-md">
                <div className="h-48 md:h-52 xl:h-60 bg-gray-900">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="p-2">
                  <h2 className="mb-2 font-semibold text-base md:text-lg">
                    {book.title}
                  </h2>
                  <p className="text-sm md:text-base">{book.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No book found.</p>
      )}
    </div>
  );
};

export default SearchPage;
