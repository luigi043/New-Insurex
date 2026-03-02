   // src/components/Partners/PartnerRegistration.tsx
   import React, { useState } from 'react';
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { z } from 'zod';
   import { UserRole } from '../../types/user.types';
   import { authApi } from '../../services/authApi';

   const partnerSchema = z.object({
     email: z.string().email('Invalid email address'),
     password: z.string().min(8, 'Password must be at least 8 characters'),
     confirmPassword: z.string(),
     companyName: z.string().min(2, 'Company name is required'),
     registrationNumber: z.string().min(2, 'Registration number is required'),
     contactPerson: z.string().min(2, 'Contact person is required'),
     phoneNumber: z.string().min(10, 'Valid phone number required'),
     address: z.string().min(5, 'Address is required'),
     role: z.enum([UserRole.Financer, UserRole.Insurer]),
   }).refine((data) => data.password === data.confirmPassword, {
     message: "Passwords don't match",
     path: ["confirmPassword"],
   });

   type PartnerFormData = z.infer<typeof partnerSchema>;

   export const PartnerRegistration: React.FC = () => {
     const [step, setStep] = useState(1);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [success, setSuccess] = useState(false);

     const {
       register,
       handleSubmit,
       watch,
       formState: { errors },
     } = useForm<PartnerFormData>({
       resolver: zodResolver(partnerSchema),
     });

     const selectedRole = watch('role');

     const onSubmit = async (data: PartnerFormData) => {
       setIsSubmitting(true);
       try {
         await authApi.registerPartner({
           email: data.email,
           password: data.password,
           firstName: data.contactPerson,
           lastName: '',
           phoneNumber: data.phoneNumber,
           role: data.role,
           companyDetails: {
             companyName: data.companyName,
             registrationNumber: data.registrationNumber,
             address: data.address,
           },
         });
         setSuccess(true);
       } catch (error) {
         console.error('Registration failed:', error);
       } finally {
         setIsSubmitting(false);
       }
     };

     if (success) {
       return (
         <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
             </svg>
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
           <p className="text-gray-600 mb-6">
             Your application has been received and is under review. You will receive an email notification once approved.
           </p>
           <button
             onClick={() => window.location.href = '/login'}
             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
           >
             Return to Login
           </button>
         </div>
       );
     }

     return (
       <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
         <div className="mb-8">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-bold">Partner Registration</h2>
             <span className="text-sm text-gray-500">Step {step} of 2</span>
           </div>
           <div className="w-full bg-gray-200 rounded-full h-2">
             <div
               className="bg-blue-600 h-2 rounded-full transition-all duration-300"
               style={{ width: step === 1 ? '50%' : '100%' }}
             />
           </div>
         </div>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           {step === 1 ? (
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Partner Type</label>
                 <div className="mt-2 grid grid-cols-2 gap-4">
                   <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                     selectedRole === UserRole.Insurer ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                   }`}>
                     <input
                       type="radio"
                       {...register('role')}
                       value={UserRole.Insurer}
                       className="sr-only"
                     />
                     <div className="text-center">
                       <div className="font-medium">Insurance Company</div>
                       <div className="text-sm text-gray-500">Offer insurance policies</div>
                     </div>
                   </label>
                   <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                     selectedRole === UserRole.Financer ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                   }`}>
                     <input
                       type="radio"
                       {...register('role')}
                       value={UserRole.Financer}
                       className="sr-only"
                     />
                     <div className="text-center">
                       <div className="font-medium">Financial Institution</div>
                       <div className="text-sm text-gray-500">Provide premium financing</div>
                     </div>
                   </label>
                 </div>
                 {errors.role && (
                   <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Company Name</label>
                 <input
                   {...register('companyName')}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                 />
                 {errors.companyName && (
                   <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                 <input
                   {...register('registrationNumber')}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                   placeholder="Business registration number"
                 />
                 {errors.registrationNumber && (
                   <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                 <input
                   {...register('contactPerson')}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                 />
                 {errors.contactPerson && (
                   <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
                 )}
               </div>

               <button
                 type="button"
                 onClick={() => setStep(2)}
                 className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
               >
                 Continue
               </button>
             </div>
           ) : (
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Email Address</label>
                 <input
                   type="email"
                   {...register('email')}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                 />
                 {errors.email && (
                   <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                 <input
                   {...register('phoneNumber')}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                 />
                 {errors.phoneNumber && (
                   <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Address</label>
                 <textarea
                   {...register('address')}
                   rows={3}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                 />
                 {errors.address && (
                   <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                 )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Password</label>
                   <input
                     type="password"
                     {...register('password')}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                   />
                   {errors.password && (
                     <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                   )}
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                   <input
                     type="password"
                     {...register('confirmPassword')}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                   />
                   {errors.confirmPassword && (
                     <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                   )}
                 </div>
               </div>

               <div className="flex space-x-3">
                 <button
                   type="button"
                   onClick={() => setStep(1)}
                   className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                 >
                   Back
                 </button>
                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                 >
                   {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                 </button>
               </div>
             </div>
           )}
         </form>
       </div>
     );
   };