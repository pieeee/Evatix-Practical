import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import { withRouter } from "react-router-dom";
import Loader from "../utils/Loader";
import { deleteProfile, getProfile, updateProfile } from "../api/profile";

const Profile = ({ history }) => {
  const [btnToggle, setBtnToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(undefined);
  const [updateFormData, setUpdateFormData] = useState({});

  const handleChange = (e) =>
    setUpdateFormData({ ...updateFormData, [e.target.name]: e.target.value });

  // updating profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await updateProfile(updateFormData);
    setIsLoading(false);
    setBtnToggle(!btnToggle);
  };

  // getting profile

  useEffect(() => {
    getProfile().then(({ user }) => {
      const bday = new Date(user.birthdate);
      setProfile({
        name: user.name,
        profession: user.profession,
        birthdate:
          bday.getDate() +
          "-" +
          (bday.getMonth() + 1) +
          "-" +
          bday.getFullYear(),
      });
    });
  }, [isLoading]);

  const profileFields = [
    {
      id: "name",
      prefix: "Full Name",
      type: "text",
      defaultValue: profile ? profile.name : "",
    },
    {
      id: "profession",
      prefix: "Profession",
      type: "text",
      defaultValue: profile ? profile.profession : "",
    },
    {
      id: "birthdate",
      prefix: "Date of Birth",
      type: "date",
      defaultValue: profile ? profile.birthdate : "",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">Welcome to your profile.</h1>
              </div>
              <div className="shadow p-6 md:p-12 max-w-3xl mx-auto">
                <div className="h-24 rounded-full items-center justify-center bg-blue-300 w-24 flex mb-6">
                  <h1 className="h1">{profileFields[0].defaultValue[0]}</h1>
                </div>
                <div>
                  {profile && (
                    <div className="flex sm:justify-between sm:flex-row flex-col">
                      <form onSubmit={handleSubmit}>
                        {profileFields.map((el, idx) => (
                          <div
                            key={idx}
                            className="mb-6 flex sm:items-center sm:justify-between sm:flex-row flex-col"
                          >
                            <div className="text-xl flex sm:flex-row flex-col sm:items-center sm:justify-between">
                              <div
                                className="sm:mr-2 w-36"
                                style={{ whiteSpace: "pre" }}
                              >
                                {el.prefix}
                                {`:`}
                              </div>
                              <div>
                                {btnToggle ? (
                                  <input
                                    name={el.id}
                                    id={el.id}
                                    type={el.type}
                                    className="form-input w-full text-gray-800 py-1 border-0 border-b rounded-none"
                                    defaultValue={el.defaultValue}
                                    onChange={handleChange}
                                  />
                                ) : (
                                  <span className="ml-auto">
                                    {el.defaultValue}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {btnToggle && (
                          <button
                            className={`btn bg-green-200 w-full sm:w-auto mt-2 sm:mt-4 ${
                              isLoading && `cursor-not-allowed bg-green-400`
                            }`}
                          >
                            {isLoading && <Loader />} Save Changes
                          </button>
                        )}
                      </form>
                      <div className="flex flex-col">
                        <button
                          className={`btn bg-blue-${
                            btnToggle ? `400` : `200`
                          }  h-12 sm:mt-2 `}
                          onClick={() => {
                            setBtnToggle(!btnToggle);
                          }}
                        >
                          {btnToggle ? "Undo Changes" : "Edit Profile"}
                        </button>
                        <button
                          className={`btn bg-red-400 w-full
                                        }  h-12 mt-2`}
                          onClick={async () => {
                            await deleteProfile();
                            history.push("/");
                          }}
                        >
                          Delete Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default withRouter(Profile);
