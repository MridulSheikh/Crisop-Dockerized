"use client";
import ErrorUi from "@/components/shared/error/ErrorUi";
import LimitSelect from "@/components/shared/limitSelect/LimitSelect";
import { LoadingUi } from "@/components/shared/loadingui/LoadingUi";
import SearchInput from "@/components/shared/searchInput/SearchInput";
import AddTeamMemberModal from "@/components/ui/admin/team/AddTeamMember";
import TeamCard from "@/components/ui/admin/team/TeamCard";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { hasPermission } from "@/helper/auth";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useAddTeamMemeberMutation,
  useGetTeamMemberQuery,
} from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hooks";
import { TUser } from "@/types/user";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const TeamPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // Roles state
  const searchParams = useSearchParams();
  const user = useAppSelector(useCurrentUser);
  const page = searchParams.get("page");
  const pageNumber = Number(page) || 1;
  const limit = Number(searchParams.get("limit")) || 15;
  const { data, isLoading, error, isError } = useGetTeamMemberQuery(
    { page: pageNumber, search: searchQuery, limit: limit },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  const [AddTeamMember, { isLoading: isChangeRoleLoading }] =
    useAddTeamMemeberMutation();

  const teamMember = data?.data?.data;
  const meta = data?.data?.meta;

  // Team handlers
  const handleAddMember = async (data: { email: string; roleId: string }) => {
    const toastId = toast.loading("Updating...");
    try {
      await AddTeamMember({
        email: data.email,
        role: data.roleId,
      }).unwrap();
      toast.update(toastId, {
        render: "Successfully add team member",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.update(toastId, {
        render: err?.data?.errorMessage ?? "something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        position: "top-center",
      });
    }
  };

  if (
    !hasPermission(user?.role as "admin" | "manager" | "super", "view:products")
  ) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Team</h1>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* LIMIT */}
          <div className="flex-shrink-0">
            <LimitSelect />
          </div>

          {/* SEARCH */}
          <div className="w-full sm:w-[260px] flex-shrink-0">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="🔍 Search Team Member by Name or Email"
            />
          </div>

          {/* ADD BUTTON */}
          <div className="flex-shrink-0">
            <AddTeamMemberModal
              roles={["admin", "manager"]}
              onAdd={handleAddMember}
              isLoading={isChangeRoleLoading}
            />
          </div>
        </div>
      </div>
      <div className="flex p-6 flex-col  gap-8">
        {/* Team Members */}
        <section className="flex-1">
          <div className=" overflow-x-auto">
            <table className="min-w-full shadow-md bg-white rounded-md overflow-hidden text-left text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMember?.map((member: TUser) => (
                  <TeamCard member={member} key={member._id} />
                ))}
                {teamMember?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {isError && <ErrorUi error={error} />}
            {isLoading && <LoadingUi />}
          </div>
          {!isLoading && (
            <div className="mt-5">
              <PaginationWithLinks
                page={meta?.page as number}
                pageSize={meta?.limit as number}
                totalCount={meta?.total as number}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeamPage;
