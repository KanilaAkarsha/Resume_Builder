const Title = ({ title, description }) => {
  return (
    <div className="text-center mt-6 text-slate-700">
      <h2 className="text-3xl sm:text-4xl font-medium">{title}</h2>
      <p className="max-sm text-slate-500 mt-4 max-w-2xl">{description}</p>
    </div>
  );
};

export default Title;
