import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

import { useBookStore } from '../store/book-store';

const UpdateBookPage = () => {
  const [image, setImage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    author: '',
    link: '',
    review: '',
  });
  const { updateBook, fetchBook, book, isLoading, error } = useBookStore();
  const navigate = useNavigate();
  const params = useParams();

  console.log('Params: ', params);

  useEffect(() => {
    fetchBook(params.id);
  }, [fetchBook, params]);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        subtitle: book.subtitle || '',
        author: book.author || '',
        link: book.link || '',
        review: book.review || '',
      });
    }
  }, [book]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, subtitle, author, link, review } = formData;

    if (!title || !author || !link) {
      toast.error('Please fill in the required info.');
    }

    const { message } = await updateBook(
      params.id,
      image,
      title,
      subtitle,
      author,
      link,
      review
    );

    toast.success(message);
    navigate(`/book/${book._id}`);
  };

  return (
    <div className="min-h-screen text-[#252422] bg-[#f5f5f5] px-4 md:px-12 pb-16">
      <h2 className="text-center font-semibold pt-8 md:text-2xl w-full max-w-xl mx-auto">
        Update Book
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center w-full max-w-xl mx-auto space-y-4 mt-10"
      >
        <div className="flex flex-col w-full">
          <label htmlFor="image" className="md:text-lg">
            Book Image<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="title" className="md:text-lg">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="subtitle" className="md:text-lg">
            Subtitle (optional)
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="author" className="md:text-lg">
            Author<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="link" className="md:text-lg">
            Link<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="review" className="md:text-lg">
            Personal Review(optional)
          </label>
          <textarea
            role={4}
            type="text"
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {error ? <p className="text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#403d39] text-[#fffcf2] py-2 font-medium rounded-lg"
        >
          {isLoading ? 'Please wait... ' : 'Update Book'}
        </button>
      </form>
    </div>
  );
};

export default UpdateBookPage;
