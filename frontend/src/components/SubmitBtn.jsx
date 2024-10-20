import { useNavigation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const SubmitBtn = ({ formBtn }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <button
      type='submit'
      className={`btn btn-block ${formBtn && "form-btn"} `}
      disabled={isSubmitting}
    >
      {isSubmitting ? "submitting..." : "submit"}
    </button>
  );
};
export default SubmitBtn;
