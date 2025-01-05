// Previous imports stay the same...

export function PropertyModal({ property, onClose, onSubmit }: PropertyModalProps) {
  // State and handlers stay the same...

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
          <h2 className="text-xl font-semibold">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <>
            <PropertyBasicInfo
              data={formData}
              onChange={handleChange}
            />

            <PropertyLocation
              data={formData}
              onChange={handleChange}
            />

            <PropertyDetails
              data={formData}
              onChange={handleChange}
            />

            <PropertyFeatures
              features={formData.features}
              onChange={(features) => handleChange('features', features)}
            />

            <PropertyImages
              images={formData.images}
              onChange={(images) => handleChange('images', images)}
            />
          </>

          <div className="sticky bottom-0 bg-white pt-4 flex justify-end gap-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {property ? 'Update Property' : 'Add Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}