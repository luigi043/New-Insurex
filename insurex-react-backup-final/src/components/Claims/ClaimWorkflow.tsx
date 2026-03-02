   import React, { useState } from 'react';
   import { ClaimNotes } from './ClaimNotes';
import { Claim, ClaimStatus } from '../../types/claim.types';
import { claimApi } from '../../services/claimApi';
import { DocumentUpload } from './DocumentUpload';

   interface ClaimWorkflowProps {
     claim: Claim;
     onUpdate: () => void;
   }

   export const ClaimWorkflow: React.FC<ClaimWorkflowProps> = ({ claim, onUpdate }) => {
     const [action, setAction] = useState<ClaimStatus | null>(null);
     const [amount, setAmount] = useState('');
     const [reason, setReason] = useState('');
     const [loading, setLoading] = useState(false);

     const handleAction = async (e: React.FormEvent) => {
       e.preventDefault();
       setLoading(true);

       try {
         await claimApi.processClaim(claim.id, {
           action: action!,
           approvedAmount: action === ClaimStatus.Approved ? parseFloat(amount) : undefined,
           rejectionReason: action === ClaimStatus.Rejected ? reason : undefined,
           notes: reason,
         });
         onUpdate();
       } catch (error) {
         console.error('Failed to process claim:', error);
       } finally {
         setLoading(false);
       }
     };

     const getAvailableActions = () => {
       switch (claim.status) {
         case ClaimStatus.Submitted:
           return [
             { value: ClaimStatus.UnderReview, label: 'Start Review', color: 'bg-blue-600' },
             { value: ClaimStatus.AdditionalInfoRequired, label: 'Request Info', color: 'bg-yellow-600' },
           ];
         case ClaimStatus.UnderReview:
           return [
             { value: ClaimStatus.Approved, label: 'Approve', color: 'bg-green-600' },
             { value: ClaimStatus.Rejected, label: 'Reject', color: 'bg-red-600' },
             { value: ClaimStatus.AdditionalInfoRequired, label: 'Request Info', color: 'bg-yellow-600' },
           ];
         case ClaimStatus.Approved:
           return [
             { value: ClaimStatus.Paid, label: 'Process Payment', color: 'bg-purple-600' },
           ];
         case ClaimStatus.Paid:
           return [
             { value: ClaimStatus.Closed, label: 'Close Claim', color: 'bg-gray-600' },
           ];
         default:
           return [];
       }
     };

     return (
       <div className="bg-white rounded-lg shadow-md p-6">
         <div className="mb-6">
           <h3 className="text-lg font-semibold mb-2">Claim Workflow</h3>
           <div className="flex items-center space-x-2">
             <span className="text-sm text-gray-600">Current Status:</span>
             <span className={`px-3 py-1 rounded-full text-sm font-medium ${
               claim.status === ClaimStatus.Approved ? 'bg-green-100 text-green-800' :
               claim.status === ClaimStatus.Rejected ? 'bg-red-100 text-red-800' :
               claim.status === ClaimStatus.Paid ? 'bg-purple-100 text-purple-800' :
               'bg-blue-100 text-blue-800'
             }`}>
               {claim.status}
             </span>
           </div>
         </div>

         <div className="grid grid-cols-2 gap-6">
           <div>
             <h4 className="font-medium mb-3">Available Actions</h4>
             <div className="space-y-2">
               {getAvailableActions().map((actionOption) => (
                 <button
                   key={actionOption.value}
                   onClick={() => setAction(actionOption.value)}
                   className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                     action === actionOption.value
                       ? 'border-blue-500 bg-blue-50'
                       : 'border-gray-200 hover:border-gray-300'
                   }`}
                 >
                   <div className="flex items-center justify-between">
                     <span className="font-medium">{actionOption.label}</span>
                     <div className={`w-3 h-3 rounded-full ${actionOption.color}`} />
                   </div>
                 </button>
               ))}
             </div>

             {action && (
               <form onSubmit={handleAction} className="mt-4 space-y-3">
                 {action === ClaimStatus.Approved && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700">
                       Approved Amount ($)
                     </label>
                     <input
                       type="number"
                       step="0.01"
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                       required
                     />
                   </div>
                 )}

                 {(action === ClaimStatus.Rejected || action === ClaimStatus.AdditionalInfoRequired) && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700">
                       {action === ClaimStatus.Rejected ? 'Rejection Reason' : 'Information Required'}
                     </label>
                     <textarea
                       value={reason}
                       onChange={(e) => setReason(e.target.value)}
                       rows={3}
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                       required
                     />
                   </div>
                 )}

                 <div className="flex space-x-2">
                   <button
                     type="button"
                     onClick={() => setAction(null)}
                     className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={loading}
                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                   >
                     {loading ? 'Processing...' : 'Confirm'}
                   </button>
                 </div>
               </form>
             )}
           </div>

           <div className="space-y-4">
             <DocumentUpload claimId={claim.id} onUpload={onUpdate} />
             <ClaimNotes claimId={claim.id} notes={claim.notes} onAdd={onUpdate} />
           </div>
         </div>

         <div className="mt-6 pt-6 border-t">
           <h4 className="font-medium mb-3">Status History</h4>
           <div className="space-y-2">
             {claim.statusHistory.map((history, index) => (
               <div key={index} className="flex items-center justify-between text-sm">
                 <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 bg-gray-400 rounded-full" />
                   <span>{history.newStatus}</span>
                 </div>
                 <span className="text-gray-500">
                   {new Date(history.changedAt).toLocaleDateString()} by {history.changedBy}
                 </span>
               </div>
             ))}
           </div>
         </div>
       </div>
     );
   };