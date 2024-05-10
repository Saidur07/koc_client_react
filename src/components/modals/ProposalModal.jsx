import React from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { editProposal, getJobById } from "../../axios/axios";
import { useForm } from "react-hook-form";
import { setLoading } from "../../redux/reducers/loadingSlice";

const ProposalModal = ({
  setShowEditProposalModal,
  showEditProposalModal,
  userProfile,
  initialData,
  jobId,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {}, // Set default values from initialData if available
  });
  const loading = useSelector((state) => state.loading.loading);

  const onSubmit = (data) => {
    dispatch(setLoading(true));
    dispatch(
      editProposal({
        dynamicParams: {
          proposalId: showEditProposalModal,
        },
        bodyData: data,
      })
    )
      .then(() =>
        dispatch(getJobById({ userId: userProfile?.user?._id, jobId: jobId }))
      )
      .then(() => {
        dispatch(setLoading(false));
        setShowEditProposalModal(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        dispatch(setLoading(false));
      });
  };

  return (
    <Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:p-8 p-4 w-[90vw] rounded-2xl bg-white lg:min-w-[480px] lg:max-w-lg "
      >
        <div className="flex flex-col max-h-[80vh] p-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">Edit proposal</p>
            <RxCross1
              className="text-2xl cursor-pointer"
              onClick={() => setShowEditProposalModal(null)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="w-1/2">
                <label htmlFor="bid_amount" className="font-medium text-sm">
                  Bid Amount (USD)
                </label>
                <input
                  type="number"
                  id="bid_amount"
                  {...register("bid_amount", { required: true })}
                  className="w-full rounded-md border mt-1 border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Ex. 500"
                />
                {errors.bid_amount && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              <div className="w-1/2">
                <label htmlFor="delivery_time" className="font-medium text-sm">
                  Delivery Time (Days)
                </label>
                <input
                  type="number"
                  id="delivery_time"
                  {...register("delivery_time", { required: true })}
                  className="w-full rounded-md border mt-1  border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Ex. 5"
                />
                {errors.delivery_time && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="proposal_description"
                className="font-medium text-sm"
              >
                Proposal Description
              </label>
              <textarea
                id="proposal_description"
                rows={6}
                {...register("proposal_description", {
                  required: true,
                })}
                className="w-full rounded-md border mt-1 border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="What makes you the best candidate for this project?"
              />
              {errors.proposal_description && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 pt-3 border-t">
          <button
            type="button"
            className="px-4 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-full"
            onClick={() => setShowEditProposalModal(null)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
              loading ||
              errors.delivery_time ||
              errors.proposal_description ||
              errors.bid_amount
                ? "cursor-not-allowed py-[18px] opacity-50"
                : "py-3"
            }`}
            disabled={
              loading ||
              errors.delivery_time ||
              errors.proposal_description ||
              errors.bid_amount
            }
          >
            {loading ? <div className="loaderProfile mx-auto "></div> : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProposalModal;
