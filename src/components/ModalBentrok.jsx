'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function ModalBentrok({ isOpen, onClose, conflictInfo }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-center">
                  <img src="/bentrok.png" alt="Logo" className="mx-auto h-40 w-auto" />
                  <DialogTitle as="h3" className="text-base justify-center font-semibold text-gray-900">
                    Ups Sorry!
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your booking schedule conflicts with another reservation.
                    </p>
                    {conflictInfo && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        ⚠️ {conflictInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-md bg-[#6077ba] px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto"
              >
                Reschedule
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.location.href = '/';
                }}
                className="inline-flex w-full justify-center rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 shadow-xs sm:ml-3 sm:w-auto"
              >
                Check Availability
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
