const Loading = () => {
    return (
      <div className="grid h-[calc(100vh-10rem)] place-items-center md:h-[calc(100vh-6rem)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-clr-primary/10 border-t-clr-primary duration-700" />
      </div>
    );
  };
  
  export default Loading;
  