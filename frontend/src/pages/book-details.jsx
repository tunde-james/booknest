import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useBookStore } from '../store/book-store';
import { useAuthStore } from '../store/auth-store';

const BookDetails = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { fetchBook, deleteBook, book, isLoading } = useBookStore();

  useEffect(() => {
    fetchBook(params.id);
  }, [fetchBook, params]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  console.log('Book: ', book);

  const handleDelete = async () => {
    const { message } = await deleteBook(params.id);
    toast.success(message);

    navigate('/');
  };

  return (
    <div className="min-h-screen text-[#252422] bg-[#f5f5f5] px-4 md:px-12 pb-10">
      <button onClick={() => navigate('/')} className="cursor-pointer py-3">
        &larr; Back
      </button>

      <div className="flex flex-col md:flex-row">
        <div className="md:basis-[30%] md:mr-6 mx-auto w-full">
          <img src={book?.image} className="mx-h-[50vh] mx-auto" />

          <Link to={book?.link} target="_blank">
            <div className="w-full flex justify-center items-center">
              <button className="bg-[#403d39] text-[#ccc5b9] px-3 py-2 w-full md:max-w-52 mt-3">
                Read
              </button>
            </div>
          </Link>
        </div>

        <div className="basis-[65%] mt-6 md:mt-0 md:max-w-4xl">
          <div className="flex justify-between items-center">
            <p>
              Uploaded by{' '}
              <span className="text-[#944424]">@{book?.user.username}</span>
            </p>

            {user?._id === book?.user?._id ? (
              <div className="text-2xl font-bold -mt-2 relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="cursor-pointer tracking-widest"
                >
                  ...
                </button>

                {open ? (
                  <div className="absolute bg-[#f5f5f5] shadow-md pb-2 px-5 text-base font-normal right-0 top-10">
                    <Link to={`/book/${book._id}/update`}>
                      <p className="mb-2 pb-2 border-b border-gray-300">
                        Update
                      </p>
                    </Link>

                    <button
                      onClick={handleDelete}
                      className="text-red-500 cursor-pointer "
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
            {book?.title}
          </h1>

          {book?.subtitle ? <h3>{book?.subtitle}</h3> : null}

          <p className="pl-5 ">Written by: {book?.author}</p>

          <p className="mt-2 font-semibold text-lg md:text-xl">Review: </p>
          <p className="md:text-lg">{book?.review}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
