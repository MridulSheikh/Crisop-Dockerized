import { TailSpin } from "react-loader-spinner";

export const LoadingUi = () => {
  return (
    <div className=" w-full h-40 flex justify-center items-center">
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};