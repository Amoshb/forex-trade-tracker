const LoadingButton = ({ loading, text, loadingText, ...props }) => {
  return (
    <button disabled={loading} {...props}>
      {loading ? loadingText : text}
    </button>
  );
};

export default LoadingButton;
