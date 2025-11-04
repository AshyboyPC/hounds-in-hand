import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Heart, Award, MapPin, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/animations";

const Volunteer = () => {
    const handleSignUp = (opportunityTitle: string) => {
        // Check if user is logged in
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            if (user.role === "volunteer") {
                window.location.href = "/dashboard/volunteer";
                return;
            }
        }
        
        // Redirect to login if not logged in
        window.location.href = "/login";
    };

    const volunteerOpportunities = [
        {
            id: 1,
            title: "Dog Walking & Exercise",
            description: "Take our furry friends on walks, provide exercise, and help with socialization in our beautiful outdoor areas.",
            timeCommitment: "2 hours",
            category: "Animal Care",
            icon: Heart,
            difficulty: "Beginner"
        },
        {
            id: 2,
            title: "Puppy Care & Feeding",
            description: "Help care for our youngest residents with feeding, cleaning, and providing love and attention.",
            timeCommitment: "3 hours",
            category: "Animal Care",
            icon: Users,
            difficulty: "Beginner"
        },
        {
            id: 3,
            title: "Dog Training & Behavior",
            description: "Work with our training team to help dogs learn basic commands and improve their adoption readiness.",
            timeCommitment: "3 hours",
            category: "Training",
            icon: Award,
            difficulty: "Advanced"
        },
        {
            id: 4,
            title: "Administrative Support",
            description: "Help with paperwork, data entry, phone calls, and other office tasks that keep our shelter running.",
            timeCommitment: "3 hours",
            category: "Administration",
            icon: Calendar,
            difficulty: "Beginner"
        },
        {
            id: 5,
            title: "Medical Care Assistant",
            description: "Assist our veterinary team with basic medical care, medication administration, and health monitoring.",
            timeCommitment: "4 hours",
            category: "Medical Care",
            icon: Heart,
            difficulty: "Advanced"
        },
        {
            id: 6,
            title: "Adoption Event Support",
            description: "Help organize and run adoption events, meet potential families, and showcase our amazing dogs.",
            timeCommitment: "4 hours",
            category: "Animal Care",
            icon: Users,
            difficulty: "Intermediate"
        },
        {
            id: 7,
            title: "Facility Maintenance",
            description: "Help maintain our facilities with cleaning, repairs, and general upkeep to ensure a safe environment.",
            timeCommitment: "3 hours",
            category: "Administration",
            icon: Award,
            difficulty: "Intermediate"
        }
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Beginner": return "bg-primary/10 text-primary";
            case "Intermediate": return "bg-warning/10 text-warning";
            case "Advanced": return "bg-destructive/10 text-destructive";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Medical Care": return "bg-destructive/10 text-destructive";
            case "Animal Care": return "bg-primary/10 text-primary";
            case "Training": return "bg-warning/10 text-warning";
            case "Administration": return "bg-muted text-muted-foreground";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const getCategoryBorder = (category: string) => {
        switch (category) {
            case "Medical Care": return "border-t-destructive";
            case "Animal Care": return "border-t-primary";
            case "Training": return "border-t-warning";
            case "Administration": return "border-t-muted-foreground";
            default: return "border-t-muted-foreground";
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Enhanced Hero Section */}
                <div className="bg-[#F8F9FA] px-6 py-20 relative overflow-hidden">
                    {/* Dog-themed background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Subtle color blobs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-warning/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-destructive/10 rounded-full blur-xl"></div>

                        {/* Scattered Logo Elements - very faded */}
                        <div className="absolute top-16 left-12 opacity-3 transform rotate-15">
                            <svg width="30" height="30" viewBox="0 0 499 499" className="text-primary">
                                <path d="M0 0 C1.2578125 1.26171875 1.2578125 1.26171875 1.2578125 3.26171875 C3.2378125 4.25171875 3.2378125 4.25171875 5.2578125 5.26171875 C5.2578125 5.92171875 5.2578125 6.58171875 5.2578125 7.26171875 C5.84433594 7.50535156 6.43085938 7.74898437 7.03515625 8 C17.41057798 13.88973852 22.26276201 30.42338759 27.01074219 40.61425781 C32.18834864 51.60602845 38.34693871 61.5725189 46.2578125 70.82421875 C48.2578125 73.26171875 48.2578125 73.26171875 48.2578125 75.26171875 C48.9178125 75.26171875 49.5778125 75.26171875 50.2578125 75.26171875 C51.9140625 76.9765625 51.9140625 76.9765625 53.7578125 79.19921875 C56.14708249 82.18217054 56.14708249 82.18217054 59.2578125 84.26171875 C59.2578125 84.92171875 59.2578125 85.58171875 59.2578125 86.26171875 C59.83660156 86.53371094 60.41539062 86.80570312 61.01171875 87.0859375 C66.83984268 90.13683368 71.74632524 94.52465713 76.2578125 99.26171875 C76.86367188 99.82375 77.46953125 100.38578125 78.09375 100.96484375 C88.75729192 111.01553843 95.54815246 123.46698098 96.11865234 138.25537109 C96.18781103 153.85423147 92.20844632 165.43413275 85.2578125 179.26171875 C84.64459531 180.56530079 84.0357659 181.87096669 83.43359375 183.1796875 C80.86456289 188.60769233 78.0663684 193.6068171 74.2578125 198.26171875 C73.5978125 198.26171875 72.9378125 198.26171875 72.2578125 198.26171875 C72.2578125 198.92171875 72.2578125 199.58171875 72.2578125 200.26171875 C71.5978125 200.26171875 70.9378125 200.26171875 70.2578125 200.26171875 C70.2578125 200.92171875 70.2578125 201.58171875 70.2578125 202.26171875 C69.5978125 202.26171875 68.9378125 202.26171875 68.2578125 202.26171875 C68.2578125 202.92171875 68.2578125 203.58171875 68.2578125 204.26171875 C64.14377146 207.28347863 59.71721087 209.78996721 55.2578125 212.26171875 C54.00097656 212.96167969 54.00097656 212.96167969 52.71875 213.67578125 C42.16133379 218.45584917 26.85131862 218.39645395 16.02978516 214.41137695 C13.04122522 213.14937261 10.14998617 211.72953868 7.2578125 210.26171875 C5.05227079 209.23486794 2.84398762 208.21388195 0.6328125 207.19921875 C-0.41390625 206.70808594 -1.460625 206.21695313 -2.5390625 205.7109375 C-12.43867588 201.23196608 -22.37039689 197.55396185 -33.1796875 196.13671875 C-35.03400391 195.88535156 -35.03400391 195.88535156 -36.92578125 195.62890625 C-58.79412664 193.5248894 -79.69315889 201.94329252 -98.9453125 211.46484375 C-106.26226619 214.97777031 -112.05323972 216.73852348 -120.2421875 216.57421875 C-121.44681641 216.57905273 -121.44681641 216.57905273 -122.67578125 216.58398438 C-136.50129382 216.46074237 -149.93473918 211.08870381 -159.7421875 201.26171875 C-160.27972656 200.18083984 -160.27972656 200.18083984 -160.828125 199.078125 C-161.65759025 196.8980945 -161.65759025 196.8980945 -164.7421875 196.26171875 C-170.72976747 188.19923483 -174.35293781 178.59527594 -177.93115234 169.29443359 C-178.65787568 167.47303127 -179.47026388 165.68635953 -180.29296875 163.90625 C-185.38558839 152.1286705 -185.78982972 137.83405145 -182.8203125 125.40234375 C-181.66264338 122.50065362 -180.35220415 119.93519377 -178.7421875 117.26171875 C-178.03835937 115.93333984 -178.03835937 115.93333984 -177.3203125 114.578125 C-174.18649861 108.90861761 -170.47714237 104.62851299 -165.7421875 100.26171875 C-164.99324219 99.49988281 -164.24429688 98.73804688 -163.47265625 97.953125 C-160.30142732 94.82726415 -156.9937047 91.91196932 -153.6171875 89.01171875 C-152.99714844 88.4703125 -152.37710938 87.92890625 -151.73828125 87.37109375 C-151.13886719 86.85546875 -150.53945312 86.33984375 -149.921875 85.80859375 C-149.38288574 85.34291992 -148.84389648 84.87724609 -148.28857422 84.39746094 C-146.7421875 83.26171875 -146.7421875 83.26171875 -143.7421875 82.26171875 C-143.7421875 81.60171875 -143.7421875 80.94171875 -143.7421875 80.26171875 C-142.62564634 79.11028568 -141.5017227 77.96550857 -140.3515625 76.84765625 C-127.15736758 63.84560979 -119.09284557 47.99653351 -111.48828125 31.33984375 C-103.89240579 14.77214505 -103.89240579 14.77214505 -97.7421875 8.26171875 C-97.05511719 7.50890625 -96.36804688 6.75609375 -95.66015625 5.98046875 C-69.71535081 -21.28202383 -29.28298642 -22.36043942 0 0 Z" fill="currentColor" transform="translate(293.7421875,247.73828125)"/>
                            </svg>
                        </div>
                        <div className="absolute top-24 right-24 opacity-2 transform -rotate-25">
                            <svg width="25" height="25" viewBox="0 0 499 499" className="text-warning">
                                <path d="M0 0 C0.91652344 0.50789063 1.83304687 1.01578125 2.77734375 1.5390625 C11.04287197 6.43114231 18.62689508 12.95756411 24 21 C24 21.66 24 22.32 24 23 C24.66 23 25.32 23 26 23 C27.57078271 25.36958682 29.02119041 27.72783472 30.4375 30.1875 C30.83259766 30.86103516 31.22769531 31.53457031 31.63476562 32.22851562 C32.41133087 33.55294055 33.18386312 34.87973924 33.95214844 36.20898438 C34.80753598 37.6710354 35.70118893 39.11064231 36.60546875 40.54296875 C51.59836911 66.95903129 54.92645846 103.14991986 48.22265625 132.390625 C43.7293782 148.35815388 35.47350857 164.08412952 21 173 C11.54471384 178.07393541 0.19176899 178.37761992 -10.25 176.4375 C-22.10124292 172.75044665 -31.265559 164.28459267 -39 155 C-39.65226562 154.23558594 -40.30453125 153.47117188 -40.9765625 152.68359375 C-55.13270564 135.65796214 -65.06981286 113.38346332 -65.203125 91.03125 C-65.20882507 90.2738855 -65.21452515 89.516521 -65.22039795 88.73620605 C-65.22980802 87.13600034 -65.23636597 85.53577559 -65.24023438 83.93554688 C-65.24986049 81.53479286 -65.28088781 79.13492573 -65.3125 76.734375 C-65.37841956 67.03975083 -64.47317543 58.41956569 -62 49 C-61.77650879 48.04988037 -61.55301758 47.09976074 -61.32275391 46.12084961 C-59.13507042 36.82645861 -55.2663821 27.5327642 -51 19 C-50.34 19 -49.68 19 -49 19 C-48.89171875 18.42121094 -48.7834375 17.84242187 -48.671875 17.24609375 C-45.89218392 7.95352182 -36.07351395 0.56391844 -28 -4 C-18.19985093 -7.34737602 -8.6480053 -4.95970028 0 0 Z" fill="currentColor" transform="translate(186,40)"/>
                            </svg>
                        </div>
                        <div className="absolute top-36 left-1/3 opacity-6 transform rotate-35">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-destructive">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute top-48 right-1/3 opacity-4 transform -rotate-45">
                            <svg width="18" height="18" viewBox="0 0 24 24" className="text-primary">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute top-64 left-1/5 opacity-5 transform rotate-55">
                            <svg width="16" height="16" viewBox="0 0 24 24" className="text-warning">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute top-80 right-1/5 opacity-4 transform -rotate-65">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-destructive">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>

                        <div className="absolute bottom-16 left-16 opacity-5 transform rotate-25">
                            <svg width="16" height="16" viewBox="0 0 24 24" className="text-primary">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute bottom-28 right-28 opacity-4 transform -rotate-35">
                            <svg width="18" height="18" viewBox="0 0 24 24" className="text-warning">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute bottom-40 left-1/4 opacity-6 transform rotate-45">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-destructive">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute bottom-52 right-1/4 opacity-4 transform -rotate-55">
                            <svg width="16" height="16" viewBox="0 0 24 24" className="text-primary">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute bottom-64 left-2/5 opacity-5 transform rotate-65">
                            <svg width="18" height="18" viewBox="0 0 24 24" className="text-warning">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute bottom-76 right-2/5 opacity-4 transform -rotate-75">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-destructive">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>

                        <div className="absolute top-1/4 left-8 opacity-4 transform rotate-85">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-primary">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute top-1/3 right-8 opacity-5 transform -rotate-95">
                            <svg width="16" height="16" viewBox="0 0 24 24" className="text-warning">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute top-1/2 left-4 opacity-4 transform rotate-105">
                            <svg width="18" height="18" viewBox="0 0 24 24" className="text-destructive">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute top-2/3 right-4 opacity-5 transform -rotate-115">
                            <svg width="14" height="14" viewBox="0 0 24 24" className="text-primary">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="absolute top-3/4 left-12 opacity-4 transform rotate-125">
                            <svg width="16" height="16" viewBox="0 0 24 24" className="text-warning">
                                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-8 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>

                    {/* Decorative curved element */}
                    <div className="absolute right-0 top-0 w-80 h-full opacity-20">
                        <svg viewBox="0 0 300 400" className="w-full h-full">
                            <path d="M150,0 Q250,100 200,200 Q150,300 100,400 L300,400 L300,0 Z" fill="hsl(var(--warning))" />
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <div className="mb-6">
                            <Heart className="w-16 h-16 text-destructive mx-auto mb-4" fill="currentColor" />
                        </div>
                        <h1 className="text-6xl display-font text-primary mb-6">
                            Make a Difference
                        </h1>
                        <p className="text-xl subheading-font text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                            Join our community of passionate volunteers helping abandoned, rescued, and surrendered dogs find their forever homes.
                            Every hour you contribute makes a real impact in a dog's life.
                        </p>

                        {/* Stats Section */}
                        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
                            <StaggerItem>
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/10">
                                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-primary">500+</div>
                                    <div className="text-sm text-muted-foreground">Active Volunteers</div>
                                </div>
                            </StaggerItem>
                            <StaggerItem>
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-destructive/10">
                                    <Heart className="w-8 h-8 text-destructive mx-auto mb-2" fill="currentColor" />
                                    <div className="text-2xl font-bold text-primary">1,200+</div>
                                    <div className="text-sm text-muted-foreground">Dogs Helped</div>
                                </div>
                            </StaggerItem>
                            <StaggerItem>
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-warning/10">
                                    <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-primary">10,000+</div>
                                    <div className="text-sm text-muted-foreground">Hours Volunteered</div>
                                </div>
                            </StaggerItem>
                        </StaggerContainer>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white border-b border-gray-100 px-6 py-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button variant="default" className="rounded-full bg-primary hover:bg-primary/90">All Opportunities</Button>
                            <Button variant="outline" className="rounded-full border-destructive text-destructive hover:bg-destructive hover:text-white">Medical Care</Button>
                            <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white">Animal Care</Button>
                            <Button variant="outline" className="rounded-full border-warning text-warning hover:bg-warning hover:text-black">Training</Button>
                            <Button variant="outline" className="rounded-full">Administration</Button>
                        </div>
                    </div>
                </div>

                {/* Volunteer Opportunities Section */}
                <div className="bg-gray-50 px-6 py-16">
                    <div className="max-w-7xl mx-auto">
                        <FadeIn direction="up">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl display-font text-primary mb-4">Volunteer Opportunities</h2>
                                <p className="text-lg subheading-font text-muted-foreground max-w-2xl mx-auto">
                                    Choose from a variety of meaningful ways to help our furry friends
                                </p>
                            </div>
                        </FadeIn>

                        {/* Opportunities Grid */}
                        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {volunteerOpportunities.map((opportunity) => {
                                const IconComponent = opportunity.icon;
                                return (
                                    <StaggerItem key={opportunity.id}>
                                        <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden border-t-4 ${getCategoryBorder(opportunity.category)}`}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`p-3 rounded-xl ${getCategoryColor(opportunity.category)}`}>
                                                        <IconComponent className="w-6 h-6" />
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(opportunity.difficulty)}`}>
                                                        {opportunity.difficulty}
                                                    </span>
                                                </div>

                                                <h3 className="heading-font text-xl font-semibold text-primary mb-3 group-hover:text-primary/80 transition-colors">
                                                    {opportunity.title}
                                                </h3>

                                                <p className="body-font text-sm text-muted-foreground mb-4 leading-relaxed">
                                                    {opportunity.description}
                                                </p>

                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{opportunity.timeCommitment}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{opportunity.category}</span>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => handleSignUp(opportunity.title)}
                                                    className="bg-warning hover:bg-warning/90 text-black px-6 py-3 rounded-full button-font w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    Join This Mission
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerContainer>

                        {/* Call to Action */}
                        <FadeIn delay={0.3} direction="up">
                            <div className="text-center mt-16">
                                <div className="bg-primary rounded-2xl p-8 text-white">
                                    <h3 className="text-2xl display-font mb-4">Ready to Start Your Volunteer Journey?</h3>
                                    <p className="text-lg mb-6 opacity-90">
                                        Join our community and make a lasting impact on the lives of dogs in need
                                    </p>
                                    <Button
                                        size="lg"
                                        className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full button-font font-semibold"
                                    >
                                        Get Started Today
                                    </Button>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Volunteer;