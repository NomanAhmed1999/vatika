'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CameraIcon, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

export default function Home() {

  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const changeSteps = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setFile(e.target.files?.[0]);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-l from-green-500 to-green-500 p-8">
      {
        currentStep === 0 ? (
          <div className="w-full flex flex-wrap justify-center items-center">
            <div className="w-1/2 h-[400px] border mr-2"></div>
            <div className="w-[500px]">
              <p className="text-5xl text-white font-thin">Create your Vatika Bestie Bottle in <span className="font-bold text-green-950">5 Easy Steps!</span></p>
              <p className="font-thin text-white mt-10 text-lg">Tag your bestie and create a one-of-a-kind Vatika shampoo bottle featuring both your names and photos! With AI-powered customization, you and your buddy can solve your hair care worries – together.</p>
              <button onClick={changeSteps} className="bg-green-700 text-white px-4 py-2 mt-2 rounded-[10px]">Get Started
                <ArrowRight size={20} className="inline-block ml-2 animate-slideLoop" />
              </button>
            </div>
          </div>
        )
          :
          currentStep === 1 ? (
            <div className="w-full flex flex-wrap justify-center items-center">
              <div className="w-1/2 h-[400px] border mr-2"></div>
              <div className="w-[500px]">
                <p className="text-5xl text-white">Step 1</p>
                <p className="font-light text-white text-lg">Enter Your Name & Your Bestie Name</p>
                <Input type="text" placeholder="Your Name" className="bg-green-500 text-white px-4 py-2 mt-2 rounded-[10px]" />
                <Input type="text" placeholder="Your Bestie Name" className="bg-green-500 text-white px-4 py-2 mt-2 rounded-[10px]" />
                <button onClick={changeSteps} className="bg-green-700 text-white px-4 py-2 mt-2 rounded-[10px]">Next
                  <ArrowRight size={20} className="inline-block ml-2 animate-slideLoop" />
                </button>
              </div>
            </div>
          )
            :
            currentStep === 2 ? (
              <div className="w-full flex flex-wrap justify-center items-center">
                <div className="w-1/2 h-[400px] border mr-2"></div>
                <div className="w-[500px]">
                  <p className="text-5xl text-white">Step 2</p>
                  <p className="font-light text-white text-lg">Choose Your Bestie's Hair Concern</p>
                  <Select>
                    <SelectTrigger className="bg-green-500 text-white">
                      <SelectValue placeholder="Select One" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-500 text-white">
                      <SelectItem className="hover:bg-green-950" value="frizz">Frizz</SelectItem>
                      <SelectItem className="hover:bg-green-950" value="rougness">Rougness</SelectItem>
                      <SelectItem className="hover:bg-green-950" value="damage">Damage</SelectItem>
                    </SelectContent>
                  </Select>
                  <button onClick={changeSteps} className="bg-green-700 text-white px-4 py-2 mt-2 rounded-[10px]">Next
                    <ArrowRight size={20} className="inline-block ml-2 animate-slideLoop" />
                  </button>
                </div>
              </div>
            )
              :
              currentStep === 3 ? (
                <div className="w-full flex flex-wrap justify-center items-center">
                  <div className="w-1/2 flex justify-center items-center mr-2 relative">
                    <img className="w-[400px]" src="images/frame.png" />
                    {file && (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Uploaded"
                        className="absolute w-[330px] h-[330px] object-cover rounded-full"
                        style={{ top: '40px', left: '162px' }}
                      />
                    )}
                  </div>
                  <div className="w-[500px]">
                    <p className="text-5xl text-white">Step 3</p>
                    <p className="font-light text-white text-lg">Upload a Fun Pic Together</p>
                    {file ? (
                      <div className="flex items-center">
                        <p className="text-xs text-white">File ready for upload: {file.name}</p>
                      </div>
                    )
                      :
                      <div className="flex items-center">
                        <p className="text-xs text-white">Tip: Upload a picture by clicking the camera icon.</p>
                      </div>
                    }
                    <CameraIcon onClick={handleButtonClick} className="w-16 h-16 text-green-800 shadow-lg cursor-pointer" />
                    <input
                      type="file"
                      id="resumeFile"
                      name="resumeFile"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button onClick={changeSteps} className="bg-green-700 text-white px-4 py-2 mt-4 rounded-[10px]">Next
                      <ArrowRight size={20} className="inline-block ml-2 animate-slideLoop" />
                    </button>
                  </div>
                </div>
              )
                :
                currentStep === 4 ? (
                  <div className="w-full flex flex-wrap justify-center items-center">
                    <div className="w-1/2 h-[400px] border mr-2"></div>
                    <div className="w-[500px]">
                      <p className="text-5xl text-white font-thin">Create your Vatika Bestie Bottle in <span className="font-bold text-green-950">5 Easy Steps!</span></p>
                      <p className="font-thin text-white mt-10 text-lg">Tag your bestie and create a one-of-a-kind Vatika shampoo bottle featuring both your names and photos! With AI-powered customization, you and your buddy can solve your hair care worries – together.</p>
                      <button onClick={changeSteps} className="bg-green-700 text-white px-4 py-2 mt-2 rounded-[10px]">Get Started
                        <ArrowRight size={20} className="inline-block ml-2 animate-slideLoop" />
                      </button>
                    </div>
                  </div>
                )
                  :
                  currentStep === 5 ? (
                    <div className="w-full flex flex-wrap justify-center items-center">
                      <div className="w-1/2 h-[400px] border mr-2"></div>
                      <div className="w-[500px]">
                        <p className="text-5xl text-white font-thin">Create your Vatika Bestie Bottle in <span className="font-bold text-green-950">5 Easy Steps!</span></p>
                        <p className="font-thin text-white mt-10 text-lg">Tag your bestie and create a one-of-a-kind Vatika shampoo bottle featuring both your names and photos! With AI-powered customization, you and your buddy can solve your hair care worries – together.</p>
                        <button onClick={changeSteps} className="bg-green-700 text-white px-4 py-2 mt-2 rounded-[10px]">Get Started
                          <ArrowRight size={20} className="inline-block ml-2 animate-slideLoop" />
                        </button>
                      </div>
                    </div>
                  )
                    :
                    <div className="w-full flex flex-wrap justify-center items-center">
                      <div className="w-1/2 h-[400px] bg-green-500 mr-2"></div>
                      <div className="w-[500px]">
                        <p className="text-5xl text-white font-thin">Create your Vatika Bestie Bottle in <span className="font-bold text-green-950">5 Easy Steps!</span></p>
                        <p className="font-thin text-white mt-10 text-lg">Tag your bestie and create a one-of-a-kind Vatika shampoo bottle featuring both your names and photos! With AI-powered customization, you and your buddy can solve your hair care worries – together.</p>
                        <button onClick={changeSteps} className="bg-green-700 text-white px-4 py-2 mt-2 rounded-[10px]">Get Started
                          <ArrowRight size={20} className="inline-block ml-2 animate-slideLoop" />
                        </button>
                      </div>
                    </div>
      }
    </main>
  )
}

