import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/animations";

const Donate = () => {
    const handleDonateNow = () => {
        alert("Redirecting to donation platform...");
    };

    const handleSponsorDog = () => {
        alert("Redirecting to dog sponsorship page...");
    };

    const handleFulfillNeed = (item: string) => {
        alert(`Redirecting to fulfill ${item} need...`);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section - Responsive */}
                <div className="bg-[#F8F9FA] px-4 sm:px-6 py-12 sm:py-16">
                    <div className="max-w-7xl mx-auto text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl display-font text-primary mb-4 sm:mb-6">Support Our Shelters</h1>
                        <p className="text-base sm:text-lg subheading-font text-muted-foreground max-w-4xl mx-auto sm:mx-0">
                            Every contribution helps provide food, medical care and spaces in need. Choose how you'd like to give.
                        </p>
                    </div>
                </div>

                {/* Donate Money Section - Responsive */}
                <div className="bg-white px-4 sm:px-6 py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto">
                        <FadeIn direction="up">
                            <h2 className="text-2xl sm:text-3xl display-font text-primary mb-6 sm:mb-8 text-center sm:text-left">Donate Money</h2>
                        </FadeIn>
                        
                        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 sm:mb-16">
                            {/* Donate to a Shelter Card */}
                            <StaggerItem>
                                <Card className="p-6 sm:p-8 bg-white shadow-sm border border-gray-100 rounded-lg">
                                    <CardContent className="p-0">
                                        <h3 className="heading-font text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">
                                            Donate to a Shelter
                                        </h3>
                                        <p className="body-font text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                                            Give directly to a shelter of your choice. Your support funds food, bedding and medical care.
                                        </p>
                                        <Button
                                            onClick={handleDonateNow}
                                            className="bg-destructive hover:bg-destructive/90 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full button-font font-semibold text-base sm:text-lg w-full sm:w-auto"
                                        >
                                            Donate Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            </StaggerItem>

                            {/* Sponsor a Dog Card */}
                            <StaggerItem>
                                <Card className="p-6 sm:p-8 bg-white shadow-sm border border-gray-100 rounded-lg">
                                    <CardContent className="p-0">
                                        <h3 className="heading-font text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">
                                            Sponsor a Dog
                                        </h3>
                                        <p className="body-font text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                                            Help cover the care of a specific dog — food, vet visits and daily needs — until they find a forever home.
                                        </p>
                                        <Button
                                            onClick={handleSponsorDog}
                                            className="bg-destructive hover:bg-destructive/90 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full button-font font-semibold text-base sm:text-lg w-full sm:w-auto"
                                        >
                                            Sponsor a Dog
                                        </Button>
                                    </CardContent>
                                </Card>
                            </StaggerItem>
                        </StaggerContainer>

                        {/* Fulfill a Wishlist Section - Responsive */}
                        <FadeIn direction="up" delay={0.2}>
                            <div className="text-center mb-8 sm:mb-12">
                                <h2 className="text-2xl sm:text-3xl display-font text-primary mb-3 sm:mb-4">Fulfill a Wishlist</h2>
                                <p className="text-base sm:text-lg subheading-font text-muted-foreground px-4">
                                    See specific items that shelters need (like food, toys, medical supplies).
                                </p>
                            </div>
                        </FadeIn>

                        {/* Wishlist Items Grid - Responsive */}
                        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
                            {/* Dog Food */}
                            <StaggerItem>
                                <Card className="p-4 sm:p-6 bg-white shadow-sm border border-gray-100 rounded-lg text-center">
                                    <CardContent className="p-0">
                                    <div className="mb-3 sm:mb-4 flex justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <div className="w-10 h-12 sm:w-12 sm:h-16 bg-orange-400 rounded-sm relative">
                                                <div className="absolute top-1 left-1 right-1 h-1 sm:h-2 bg-orange-500 rounded-sm"></div>
                                                <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 text-xs text-white font-bold">🐕</div>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="heading-font text-base sm:text-lg font-semibold text-primary mb-2">
                                        Dog Food
                                    </h3>
                                    <p className="body-font text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                        Essential nutrition for all sizes
                                    </p>
                                    <Button
                                        onClick={() => handleFulfillNeed("Dog Food")}
                                        className="bg-warning hover:bg-warning/90 text-black px-4 sm:px-6 py-2 rounded-full button-font w-full font-semibold text-sm sm:text-base"
                                    >
                                        Fulfill Need
                                    </Button>
                                </CardContent>
                            </Card>

                            </StaggerItem>

                            {/* Toys for Enrichment */}
                            <StaggerItem>
                                <Card className="p-4 sm:p-6 bg-white shadow-sm border border-gray-100 rounded-lg text-center">
                                    <CardContent className="p-0">
                                    <div className="mb-3 sm:mb-4 flex justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <div className="relative">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-400 rounded-full"></div>
                                                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-red-400 rounded-full absolute -top-1 -right-1"></div>
                                                <div className="w-3 h-6 sm:w-4 sm:h-8 bg-blue-400 rounded-full absolute top-2 left-4 sm:left-6"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="heading-font text-base sm:text-lg font-semibold text-primary mb-2">
                                        Toys for Enrichment
                                    </h3>
                                    <p className="body-font text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                        Mental stimulation and play
                                    </p>
                                    <Button
                                        onClick={() => handleFulfillNeed("Toys for Enrichment")}
                                        className="bg-warning hover:bg-warning/90 text-black px-4 sm:px-6 py-2 rounded-full button-font w-full font-semibold text-sm sm:text-base"
                                    >
                                        Fulfill Need
                                    </Button>
                                </CardContent>
                            </Card>

                            </StaggerItem>

                            {/* Blankets & Bedding */}
                            <StaggerItem>
                                <Card className="p-4 sm:p-6 bg-white shadow-sm border border-gray-100 rounded-lg text-center">
                                    <CardContent className="p-0">
                                    <div className="mb-3 sm:mb-4 flex justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <div className="space-y-1">
                                                <div className="w-10 h-1 sm:w-12 sm:h-2 bg-pink-300 rounded-sm"></div>
                                                <div className="w-10 h-1 sm:w-12 sm:h-2 bg-pink-400 rounded-sm"></div>
                                                <div className="w-10 h-1 sm:w-12 sm:h-2 bg-yellow-300 rounded-sm"></div>
                                                <div className="w-10 h-1 sm:w-12 sm:h-2 bg-pink-300 rounded-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="heading-font text-base sm:text-lg font-semibold text-primary mb-2">
                                        Blankets & Bedding
                                    </h3>
                                    <p className="body-font text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                        Provides warmth and comfort
                                    </p>
                                    <Button
                                        onClick={() => handleFulfillNeed("Blankets & Bedding")}
                                        className="bg-warning hover:bg-warning/90 text-black px-4 sm:px-6 py-2 rounded-full button-font w-full font-semibold text-sm sm:text-base"
                                    >
                                        Fulfill Need
                                    </Button>
                                </CardContent>
                            </Card>

                            </StaggerItem>

                            {/* Medical Supplies */}
                            <StaggerItem>
                                <Card className="p-4 sm:p-6 bg-white shadow-sm border border-gray-100 rounded-lg text-center">
                                    <CardContent className="p-0">
                                    <div className="mb-3 sm:mb-4 flex justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <div className="relative">
                                                <div className="w-10 h-6 sm:w-12 sm:h-8 bg-white border-2 border-blue-400 rounded-sm"></div>
                                                <div className="absolute top-1 left-2 sm:left-3 w-4 sm:w-6 h-1 bg-blue-400"></div>
                                                <div className="absolute top-2 sm:top-3 left-1 w-1 sm:w-2 h-3 sm:h-4 bg-blue-400 rounded-sm"></div>
                                                <div className="absolute top-1 sm:top-2 right-1 w-2 sm:w-3 h-1 sm:h-2 bg-red-400 rounded-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="heading-font text-base sm:text-lg font-semibold text-primary mb-2">
                                        Medical Supplies
                                    </h3>
                                    <p className="body-font text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                        For health check treatments
                                    </p>
                                    <Button
                                        onClick={() => handleFulfillNeed("Medical Supplies")}
                                        className="bg-warning hover:bg-warning/90 text-black px-4 sm:px-6 py-2 rounded-full button-font w-full font-semibold text-sm sm:text-base"
                                    >
                                        Fulfill Need
                                    </Button>
                                </CardContent>
                            </Card>
                            </StaggerItem>
                        </StaggerContainer>

                        {/* Security Notice - Responsive */}
                        <FadeIn delay={0.3}>
                            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-12 sm:mb-16">
                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-muted-foreground">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <p className="body-font text-xs sm:text-sm text-center sm:text-left">
                                        All donations are processed securely. 100% of funds go directly to shelters and dogs.
                                    </p>
                                    <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                            </div>
                        </div>
                        </FadeIn>

                        {/* Your Impact Section - Responsive */}
                        <FadeIn delay={0.4} direction="up">
                            <div className="text-center">
                                <h2 className="text-2xl sm:text-3xl display-font text-primary mb-4 sm:mb-6">Your Impact</h2>
                                <p className="text-lg sm:text-xl subheading-font text-warning px-4">
                                    $25 feeds a dog for a week • $500 provides emergency care
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Donate;