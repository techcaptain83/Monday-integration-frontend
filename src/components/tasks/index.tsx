import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { useLocalStorage } from 'usehooks-ts';
import withAuth from '../../hoc/with-auth-redirect';
import TaskTimelogModal from '../taskTimelogModal';

const ProjectTasks: React.FC = () => {
    const [profile] = useLocalStorage<any>("profile", {});
    const { boardID } = useParams();
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useLocalStorage("access_token", "");
    const [showModal, setShowModal] = useState<boolean>(false)
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({})
    const [groups, setGroups] = useState([]);
    const [groupOption, setgroupOption] = useState<any>([]);
    const [groupId, setGroupId] = useState();

    // const pathname
    const handleGetLists = async () => {
        try {
            console.log('handleGetLists boardID', boardID);
            const result: any = await axios.get(
                `${process.env.REACT_APP_BACKEND_API}/portals/${boardID}/groups?access_token=${accessToken}`
            );
            if (result) {
                let groups: any = [];
                groups = result?.data.boards[0].groups;
                console.log('handleGetLists ', groups);
                setGroups(groups);
                const options :any[] = [];
                groups?.map((group : any) => {
                    const data = {
                        id: group.id,
                        name: group.title
                    };
                    options.push(data);
                });
                setgroupOption(options);
            }
        } catch (error) {
            console.log('error = ', error);
        }
    }

    useEffect(() => {
        handleGetLists()
    }, [boardID]);

    const handleGetProjectTasks = async () => {
        try {
            const list_parmas: any[] =[];
            groups?.map((item: any) => {
                const data = {
                    id: item.id,
                    name: item.title
                }
                list_parmas.push(data);
            });
            const params = {
                access_token: accessToken,
                ids: list_parmas,
            }
            console.log('handleGetProjectTasks', params);
            const result: any = await axios.get(
                `${process.env.REACT_APP_BACKEND_API}/portals/tasks`,
                {params}
            );
            if (result) {
                let tasks: any = []
                tasks = result?.data
                console.log('tasks', tasks);
                setTasks(tasks);
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: index.tsx:11 ~ handleCallback ~ error:",
                error
            );
        }
    }
    useEffect(() => {
    }, [groups]);

    return (
        <div className="flex flex-col items-center justify-center">
            {/* <div className="flex flex-col items-center justify-center h-screen"> */}
            <div className='flex items-center justify-between w-full max-w-2xl mt-8'>
                <h1 className="text-2xl">Projects Tasks of: {profile?.username || ""}</h1>
                <button className="px-3 py-2 text-sm font-semibold text-white bg-blue-500 rounded lg:px-4 hover:bg-blue-600" onClick={() => navigate(-1)}>Back</button>
            </div>
            <div>
                <div className="max-w-[80%] m-auto mt-10">
                    <div className="relative overflow-hidden not-prose bg-slate-50 rounded-xl dark:bg-slate-800/25">
                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                        <div className="relative overflow-auto rounded-xl">
                            <div className="my-8 overflow-auto shadow-sm">
                                {groups?.map((group: any) => (
                                <>
                                <h1>{`Group Name: ${group?.title}`}</h1>
                                <table className="w-full text-sm border-collapse table-fixed">
                                    <thead>
                                        <tr>
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 pl-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[50px]">S.N</th>
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 pl-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[300px]">Name</th>
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[150px]">State</th>
                                            {/* <th colSpan={2} className="p-4 pt-0 pb-3 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[250px]">Log Hours</th> */}
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 pr-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[200px]">Actions</th>
                                        </tr>
                                        {/* <tr>
                                            <th className="p-4 pb-3 pr-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[150px]">Non-Billable</th>
                                            <th className="p-4 pb-3 pr-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[150px]">Billable</th>
                                        </tr> */}
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-800">
                                        {
                                            group.items && group.items?.map((item: any, index: number) => (
                                                <tr key={index}>
                                                    <td className="p-4 pl-8 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{index + 1}.</td>
                                                    <td className="p-4 pl-8 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{item?.name ?? 'N/A'}</td>
                                                    <td className="p-4 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{item?.state ?? 'N/A'}</td>
                                                    {/* <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{task?.log_hours?.non_billable_hours}</td> */}
                                                    {/* <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{task?.log_hours?.billable_hours}</td> */}
                                                    <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                                                        <button
                                                            onClick={() => { setTaskData(item); setShowModal(true); setGroupId(group.id)}}
                                                            className="px-3 text-sm font-semibold text-blue-600 rounded cursor-pointer lg:px-4 dark:text-blue-500 hover:underline"
                                                        >Add Time log</button>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                                </>
                                ))}
                            </div>
                        </div>
                        <div className="absolute inset-0 border pointer-events-none border-black/5 rounded-xl dark:border-white/5"></div>
                    </div>
                </div>
            </div>
            {
                showModal &&
                <TaskTimelogModal groupId={groupId!} showModal={showModal} setShowModal={setShowModal} taskData={taskData} groupOption={groupOption} boardId = {boardID!} />
            }
        </div>
    )
}

export default withAuth(ProjectTasks)