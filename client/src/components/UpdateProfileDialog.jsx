// import React, { useState } from 'react'
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
// import { Label } from './ui/label'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import { Loader2 } from 'lucide-react'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
// import { USER_API_END_POINT } from '@/utils/constant'
// import { setUser } from '@/redux/authSlice'
// import { toast } from 'sonner'

// const UpdateProfileDialog = ({ open, setOpen }) => {
//     const [loading, setLoading] = useState(false);
//     const { user } = useSelector(store => store.auth);

//     const [input, setInput] = useState({
//         fullname: user?.fullname || "",
//         email: user?.email || "",
//         phoneNumber: user?.phoneNumber || "",
//         bio: user?.profile?.bio || "",
//         skills: user?.profile?.skills?.map(skill => skill) || "",
//         file: user?.profile?.resume || ""
//     });
//     const dispatch = useDispatch();

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     }

//     const fileChangeHandler = (e) => {
//         const file = e.target.files?.[0];
//         setInput({ ...input, file })
//     }

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("fullname", input.fullname);
//         formData.append("email", input.email);
//         formData.append("phoneNumber", input.phoneNumber);
//         formData.append("bio", input.bio);
//         formData.append("skills", input.skills);
//         if (input.file) {
//             formData.append("file", input.file);
//         }
//         try {
//             setLoading(true);
//             const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 },
//                 withCredentials: true
//             });
//             if (res.data.success) {
//                 dispatch(setUser(res.data.user));
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.response.data.message);
//         } finally{
//             setLoading(false);
//         }
//         setOpen(false);
//         console.log(input);
//     }



//     return (
//         <div>
//             <Dialog open={open}>
//                 <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
//                     <DialogHeader>
//                         <DialogTitle>Update Profile</DialogTitle>
//                     </DialogHeader>
//                     <form onSubmit={submitHandler}>
//                         <div className='grid gap-4 py-4'>
//                             <div className='grid grid-cols-4 items-center gap-4'>
//                                 <Label htmlFor="name" className="text-right">Name</Label>
//                                 <Input
//                                     id="name"
//                                     name="name"
//                                     type="text"
//                                     value={input.fullname}
//                                     onChange={changeEventHandler}
//                                     className="col-span-3"
//                                 />
//                             </div>
//                             <div className='grid grid-cols-4 items-center gap-4'>
//                                 <Label htmlFor="email" className="text-right">Email</Label>
//                                 <Input
//                                     id="email"
//                                     name="email"
//                                     type="email"
//                                     value={input.email}
//                                     onChange={changeEventHandler}
//                                     className="col-span-3"
//                                 />
//                             </div>
//                             <div className='grid grid-cols-4 items-center gap-4'>
//                                 <Label htmlFor="number" className="text-right">Number</Label>
//                                 <Input
//                                     id="number"
//                                     name="number"
//                                     value={input.phoneNumber}
//                                     onChange={changeEventHandler}
//                                     className="col-span-3"
//                                 />
//                             </div>
//                             <div className='grid grid-cols-4 items-center gap-4'>
//                                 <Label htmlFor="bio" className="text-right">Bio</Label>
//                                 <Input
//                                     id="bio"
//                                     name="bio"
//                                     value={input.bio}
//                                     onChange={changeEventHandler}
//                                     className="col-span-3"
//                                 />
//                             </div>
//                             <div className='grid grid-cols-4 items-center gap-4'>
//                                 <Label htmlFor="skills" className="text-right">Skills</Label>
//                                 <Input
//                                     id="skills"
//                                     name="skills"
//                                     value={input.skills}
//                                     onChange={changeEventHandler}
//                                     className="col-span-3"
//                                 />
//                             </div>
//                             <div className='grid grid-cols-4 items-center gap-4'>
//                                 <Label htmlFor="file" className="text-right">Resume</Label>
//                                 <Input
//                                     id="file"
//                                     name="file"
//                                     type="file"
//                                     accept="application/pdf"
//                                     onChange={fileChangeHandler}
//                                     className="col-span-3"
//                                 />
//                             </div>
//                         </div>
//                         <DialogFooter>
//                             {
//                                 loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
//                             }
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     )
// }

// export default UpdateProfileDialog


// import React, { useState } from 'react'
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
// import { Label } from './ui/label'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import { Loader2 } from 'lucide-react'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
// import { USER_API_END_POINT } from '@/utils/constant'
// import { setUser } from '@/redux/authSlice'
// import { toast } from 'sonner'
// import * as pdfjsLib from "pdfjs-dist"
// import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// const predefinedSkills = [
//     "JavaScript", "React", "Python", "Machine Learning", "TensorFlow", "Node.js",
//     "CSS", "HTML", "Redux", "SQL", "MongoDB", "Java", "C++", "AWS", "Docker"
    // "TypeScript", "GraphQL", "Express.js", "Flutter", "Swift", "Kotlin", "PHP",
    // "Go", "Rust", "Scala", "Ruby", "Perl", "C#", "Angular", "Vue.js", "Next.js",
    // "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET", "PostgreSQL",
    // "MySQL", "SQLite", "Oracle DB", "Firebase", "Redis", "Kubernetes",
    // "CI/CD", "Jenkins", "Git", "GitHub", "GitLab", "Bitbucket", "JIRA",
    // "Trello", "Agile Methodology", "Scrum", "Kanban", "Project Management",
    // "Data Science", "Big Data", "Hadoop", "Apache Spark", "Pandas",
    // "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "PyTorch", "Keras",
    // "Natural Language Processing", "Computer Vision", "Deep Learning",
    // "Cybersecurity", "Ethical Hacking", "Blockchain", "Cryptography",
    // "Cloud Computing", "Google Cloud", "Azure", "DevOps", "Terraform",
    // "Marketing", "SEO", "Content Writing", "Copywriting", "Social Media",
    // "Digital Marketing", "Email Marketing", "Google Ads", "Facebook Ads",
    // "UI/UX Design", "Adobe Photoshop", "Adobe Illustrator", "Figma", "Sketch",
    // "Product Management", "Business Analysis", "Finance", "Accounting",
    // "Sales", "Customer Relationship Management", "Public Speaking",
    // "Leadership", "Time Management", "Communication Skills"
// ];

// const UpdateProfileDialog = ({ open, setOpen }) => {
//     const [loading, setLoading] = useState(false);
//     const { user } = useSelector(store => store.auth);

//     const [input, setInput] = useState({
//         fullname: user?.fullname || "",
//         email: user?.email || "",
//         phoneNumber: user?.phoneNumber || "",
//         bio: user?.profile?.bio || "",
//         skills: user?.profile?.skills?.join(", ") || "",
//         file: user?.profile?.resume || ""
//     });
//     const dispatch = useDispatch();

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     }

//     const extractSkills = async (file) => {
//         setLoading(true);
//         const reader = new FileReader();
//         reader.readAsArrayBuffer(file);
//         reader.onload = async () => {
//             try {
//                 const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
//                 let text = "";
//                 for (let i = 1; i <= pdf.numPages; i++) {
//                     const page = await pdf.getPage(i);
//                     const content = await page.getTextContent();
//                     text += content.items.map((item) => item.str).join(" ") + " ";
//                 }
//                 const detectedSkills = predefinedSkills.filter(skill =>
//                     text.toLowerCase().includes(skill.toLowerCase())
//                 );
//                 setInput(prev => ({ ...prev, skills: detectedSkills.join(", ") }));
//             } catch (error) {
//                 console.error("Error extracting text from PDF:", error);
//                 toast.error("Failed to extract skills from the resume.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//     };

//     const fileChangeHandler = (e) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setInput({ ...input, file });
//             extractSkills(file); // Automatically extract skills
//         }
//     }

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("fullname", input.fullname);
//         formData.append("email", input.email);
//         formData.append("phoneNumber", input.phoneNumber);
//         formData.append("bio", input.bio);
//         formData.append("skills", input.skills);
//         if (input.file) {
//             formData.append("file", input.file);
//         }
//         try {
//             setLoading(true);
//             const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//                 withCredentials: true
//             });
//             if (res.data.success) {
//                 dispatch(setUser(res.data.user));
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.response?.data?.message || "Update failed");
//         } finally {
//             setLoading(false);
//             setOpen(false);
//         }
//     }

//     return (
//         <Dialog open={open}>
//             <DialogContent className="sm:max-w-[800px]" onInteractOutside={() => setOpen(false)}>
//                 <DialogHeader>
//                     <DialogTitle>Update Profile</DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={submitHandler}>
//                     <div className='grid gap-4 py-4'>
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="fullname" className="text-right">Name</Label>
//                             <Input
//                                 id="fullname"
//                                 name="fullname"
//                                 type="text"
//                                 value={input.fullname}
//                                 onChange={changeEventHandler}
//                                 className="col-span-3"
//                             />
//                         </div>
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="email" className="text-right">Email</Label>
//                             <Input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 value={input.email}
//                                 onChange={changeEventHandler}
//                                 className="col-span-3"
//                             />
//                         </div>
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="phoneNumber" className="text-right">Number</Label>
//                             <Input
//                                 id="phoneNumber"
//                                 name="phoneNumber"
//                                 value={input.phoneNumber}
//                                 onChange={changeEventHandler}
//                                 className="col-span-3"
//                             />
//                         </div>
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="bio" className="text-right">Bio</Label>
//                             <Input
//                                 id="bio"
//                                 name="bio"
//                                 value={input.bio}
//                                 onChange={changeEventHandler}
//                                 className="col-span-3"
//                             />
//                         </div>
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="skills" className="text-right">Skills</Label>
//                             <Input
//                                 id="skills"
//                                 name="skills"
//                                 value={input.skills}
//                                 readOnly
//                                 className="col-span-3 bg-gray-100"
//                             />
//                         </div>
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="file" className="text-right">Resume</Label>
//                             <Input
//                                 id="file"
//                                 name="file"
//                                 type="file"
//                                 accept="application/pdf"
//                                 onChange={fileChangeHandler}
//                                 className="col-span-3"
//                             />
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         {loading ? <Button disabled className="w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</Button> : <Button type="submit" className="w-full">Update</Button>}
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default UpdateProfileDialog;

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const predefinedSkills = [
    "JavaScript", "React", "Python", "Machine Learning", "TensorFlow", "Node.js",
    "CSS", "HTML", "Redux", "SQL", "MongoDB", "Java", "C++", "AWS", "Docker",
    "TypeScript", "GraphQL", "Express.js", "Flutter", "Swift", "Kotlin", "PHP",
    "Go", "Rust", "Scala", "Ruby", "Perl", "C#", "Angular", "Vue.js", "Next.js",
    "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET", "PostgreSQL",
    "MySQL", "SQLite", "Oracle DB", "Firebase", "Redis", "Kubernetes",
    "CI/CD", "Jenkins", "Git", "GitHub", "GitLab", "Bitbucket", "JIRA",
    "Trello", "Agile Methodology", "Scrum", "Kanban", "Project Management",
    "Data Science", "Big Data", "Hadoop", "Apache Spark", "Pandas",
    "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "PyTorch", "Keras",
    "Natural Language Processing", "Computer Vision", "Deep Learning",
    "Cybersecurity", "Ethical Hacking", "Blockchain", "Cryptography",
    "Cloud Computing", "Google Cloud", "Azure", "DevOps", "Terraform",
    "Marketing", "SEO", "Content Writing", "Copywriting", "Social Media",
    "Digital Marketing", "Email Marketing", "Google Ads", "Facebook Ads",
    "UI/UX Design", "Adobe Photoshop", "Adobe Illustrator", "Figma", "Sketch",
    "Product Management", "Business Analysis", "Finance", "Accounting",
    "Sales", "Customer Relationship Management", "Public Speaking",
    "Leadership", "Time Management", "Communication Skills"
];

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        file: user?.profile?.resume || ""
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const extractSkills = async (file) => {
        setLoading(true);
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            try {
                const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
                let text = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map((item) => item.str).join(" ") + " ";
                }
                const detectedSkills = predefinedSkills.filter(skill =>
                    text.toLowerCase().includes(skill.toLowerCase())
                );
                setInput(prev => ({ ...prev, skills: detectedSkills.join(", ") }));
            } catch (error) {
                console.error("Error extracting text from PDF:", error);
                toast.error("Failed to extract skills from the resume.");
            } finally {
                setLoading(false);
            }
        };
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            extractSkills(file);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[800px]" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="fullname" className="text-right">Name</Label>
                            <Input id="fullname" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="phoneNumber" className="text-right">Number</Label>
                            <Input id="phoneNumber" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="bio" className="text-right">Bio</Label>
                            <Input id="bio" name="bio" value={input.bio} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="skills" className="text-right">Skills</Label>
                            <Input id="skills" name="skills" value={input.skills} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="file" className="text-right">Resume</Label>
                            <Input id="file" name="file" type="file" accept="application/pdf" onChange={fileChangeHandler} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        {loading ? <Button disabled className="w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</Button> : <Button type="submit" className="w-full">Update</Button>}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
