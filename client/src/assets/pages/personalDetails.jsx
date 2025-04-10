import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import StarRatings from 'react-star-ratings';
import { colors } from "@mui/material";

export default function PersonalDetails() {
  let location = useLocation();
  let navigate = useNavigate();
  let detail = location.state?.personaldata;

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const token = Cookies.get("token");
  const [canreview, setCanreview] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      
      try {
        const response = await axios.get(`https://ecomm-8piu.onrender.com/ecomm/product/getReviews/${detail._id}`, {
          headers: {token},
        });
        setReviews(response.data.reviews);
        console.log(reviews);
        setCanreview(response.data.canreview);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("There was an error fetching reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [detail._id]);

  const placeOrder = () => {
    navigate("/order", { state: { orderProduct: detail } });
  };

  const handleAddToCart = async () => {
    try {
      let returnValue = await axios.post(`https://ecomm-8piu.onrender.com/ecomm/productOrder/addToCart/${detail._id}`, { token });
      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("There was an error adding the product to your cart. Please try again.");
    }
  };

  const handleReviewSubmit = async () => {
    if (!token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    if (rating === 0 || !review) {
      toast.error("Please provide a rating and a review.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`https://ecomm-8piu.onrender.com/ecomm/product/addReview/${detail._id}`, {
        token,
        rating,
        review
      });
      console.log(response.data);
      setReviews(response.data.reviews);
      toast.success("Review submitted successfully!");
      setRating(0);
      setReview('');
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("There was an error submitting your review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <br /><br />

      <div className="row align-items-center g-4 shadow-lg p-4 rounded" style={{ marginTop: '40px' }}>
        <div className="col-12 col-md-6 text-center">
          <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {detail?.images?.map((item, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <img
                    src={item}
                    className="d-block w-100 img-fluid rounded shadow-sm border"
                    style={{ height: "350px", objectFit: "cover" }}
                    alt={`Image ${index}`}
                  />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: "#000000" }}></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: "#000000" }}></span>
            </button>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <h1 className="display-5 fw-bold text-center text-md-start" style={{ color: "#000000" }}>
            {detail?.name}
          </h1>
          <p className="lead text-dark text-center text-md-start">{detail?.description}</p>

          <div className="my-3 p-3 border rounded text-center text-md-start" style={{ backgroundColor: "#F8F8F8" }}>
            {detail?.discount && (
              <p className="fs-4 fw-bold text-danger mb-1">
                <del className="text-muted">₹{detail?.price}</del>
                <span className="ms-2 text-success">({detail?.discount} Off)</span>
              </p>
            )}
            {detail?.discountPrice && (
              <p className="fs-4 fw-bold" style={{ color: "#000000" }}>
                Final Price: ₹{detail?.discountPrice}
              </p>
            )}
          </div>

          <div className="d-flex flex-column flex-md-row gap-3 mt-4">
            <button
              className="btn btn-lg w-100 w-md-auto"
              style={{
                backgroundColor: "#FF5733",
                border: "1px solid #FF5733",
                color: "#ffffff",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
              }}
              onClick={placeOrder}
            >
              Place Order
            </button>
            <button
              className="btn btn-lg w-100 w-md-auto"
              style={{
                backgroundColor: "#3498db",
                border: "1px solid #3498db",
                color: "#ffffff",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
              }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      {canreview ? (
        <div className="mt-5 p-3 border rounded">
          <h5 className="mb-3" style={{ color: "#000000" }}>Submit a Review</h5>

          <StarRatings
            rating={rating}
            starRatedColor="gold"
            starDimension="30px"
            starSpacing="5px"
            changeRating={setRating}
            numberOfStars={5}
            name="rating"
          />

          <textarea
            className="form-control mt-3"
            rows="4"
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            style={{ backgroundColor: 'rgba(1,1,1,0)', borderColor: "#000000" }}
          ></textarea>

          <button
            className="btn btn-primary mt-3 w-100"
            style={{ backgroundColor: "#ffelds", borderColor: "#000000" }}
            onClick={handleReviewSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      ) : (
        <div></div>
      )}

      {/* Displaying Reviews - 2 per Row */}
      <div className="mt-5 p-3 border rounded">
        <h5 className="mb-3" style={{ color: "#000000" }}>Product Reviews</h5>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-dark" role="status"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p style={{ color: 'black' }}>No reviews yet. Be the first to review! Shop Now</p>
        ) : (
          <div className="row">
            {reviews.map((review, index) => (
              <div key={index} className="col-12 col-md-6 mb-4">
                <div className="card shadow-sm" style={{ backgroundColor: 'rgba(1,1,1,0)', borderColor: "#000000" }}>
                  <div className="card-body">
                    <p className="text-muted">{review.user.email}</p>
                    <StarRatings
                      rating={review.rating}
                      starRatedColor="gold"
                      starDimension="20px"
                      starSpacing="2px"
                      numberOfStars={5}
                      name={`rating-${index}`}
                    />
                    <p className="mt-2" style={{ color: "#333" }}>{review.review}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
