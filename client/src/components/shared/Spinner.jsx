const Spinner = ({ size = "md" }) => {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} animate-spin`}
        style={{ border: "4px solid #e5e5e5", borderTop: "4px solid #1a1a1a" }} />
    </div>
  );
};
export default Spinner;
