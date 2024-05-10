import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { editInfo, getProfile, getSkills } from "../../axios/axios";
import { setLoading } from "../../redux/reducers/loadingSlice";
import { useForm } from "react-hook-form";
import Select from "react-tailwindcss-select";

const AddLanguageModal = ({ setShowSkillsModal, userProfile, initialData }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {}, // Set default values from initialData if available
  });

  const [skills, setSkills] = useState(
    userProfile?.skills?.map((skill) => ({
      value: skill._id,
      label: skill.name,
    }))
  );

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Skills data
        const response = await dispatch(getSkills());
        const modifiedSkills = response?.payload?.data.map((skill) => ({
          value: skill._id,
          label: skill.name,
        }));
        setOptions(modifiedSkills);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  const loading = useSelector((state) => state.loading.loading);

  const onSubmit = (data) => {
    dispatch(setLoading(true));
    dispatch(
      editInfo({
        dynamicParams: {
          userId: userProfile?.user?._id,
        },
        bodyData: { skills: skills?.map((skill) => skill.value) },
      })
    )
      .then(() => dispatch(getProfile()))
      .then(() => {
        dispatch(setLoading(false));
        setShowSkillsModal(null);
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
            <p className="text-3xl font-semibold">Edit your skills</p>
            <RxCross1
              className="text-2xl cursor-pointer"
              onClick={() => setShowSkillsModal(null)}
            />
          </div>
          <div classname="flex flex-col space-y-2 my-4  ">
            {" "}
            <div className="min-h-[300px] mt-4">
              {" "}
              <Select
                value={skills}
                onChange={(e) => setSkills(e)}
                options={options}
                isSearchable
                isMultiple
                loading={loading}
                primaryColor={"lime"}
                placeholder="Select Skills"
                classNames={{
                  menuButton: ({ isDisabled }) =>
                    `flex rounded-lg text-black border border-gray-300 p-[2px] shadow-sm transition-all duration-300 focus:outline-none ${
                      isDisabled
                        ? "bg-gray-100"
                        : "bg-white hover:border-gray-400 focus:border-primary focus:ring focus:ring-primary/10"
                    }`,
                  menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-2 mt-1.5 rounded-lg text-gray-700",
                  listItem: ({ isSelected }) =>
                    `block transition duration-200 p-2 rounded-lg cursor-pointer select-none truncate rounded ${
                      isSelected
                        ? `text-white bg-primary`
                        : `text-black hover:bg-green-100 hover:text-primary`
                    }`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 pt-3 border-t">
          <button
            type="button"
            className="px-4 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none w-full"
            onClick={() => setShowSkillsModal(null)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4  font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-all focus:outline-none w-full ${
              loading || !skills
                ? "cursor-not-allowed py-[18px] opacity-50"
                : "py-3"
            }`}
            disabled={loading || !skills}
          >
            {loading ? <div className="loaderProfile mx-auto "></div> : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLanguageModal;
