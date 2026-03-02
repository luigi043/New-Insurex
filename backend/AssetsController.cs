using System.Threading.Tasks;
using InsureX.Application.DTOs;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _assetService;

        public AssetsController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        // GET api/assets?policyId=1&type=Vehicle
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? policyId,
            [FromQuery] AssetType? type,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var result = await _assetService.GetPagedAsync(policyId, type, search, page, pageSize);
            return Ok(result);
        }

        // GET api/assets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var asset = await _assetService.GetByIdAsync(id);
            if (asset == null) return NotFound();
            return Ok(asset);
        }

        // POST api/assets/vehicle
        [HttpPost("vehicle")]
        public async Task<IActionResult> CreateVehicle([FromBody] CreateAssetDto<VehicleData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.Vehicle);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/property
        [HttpPost("property")]
        public async Task<IActionResult> CreateProperty([FromBody] CreateAssetDto<PropertyData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.Property);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/watercraft
        [HttpPost("watercraft")]
        public async Task<IActionResult> CreateWatercraft([FromBody] CreateAssetDto<WatercraftData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.Watercraft);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/aviation
        [HttpPost("aviation")]
        public async Task<IActionResult> CreateAviation([FromBody] CreateAssetDto<AviationData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.Aviation);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/stock
        [HttpPost("stock")]
        public async Task<IActionResult> CreateStock([FromBody] CreateAssetDto<StockInventoryData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.StockInventory);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/accounts-receivable
        [HttpPost("accounts-receivable")]
        public async Task<IActionResult> CreateAccountsReceivable([FromBody] CreateAssetDto<AccountsReceivableData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.AccountsReceivable);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/machinery
        [HttpPost("machinery")]
        public async Task<IActionResult> CreateMachinery([FromBody] CreateAssetDto<MachineryData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.Machinery);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/plant-equipment
        [HttpPost("plant-equipment")]
        public async Task<IActionResult> CreatePlantEquipment([FromBody] CreateAssetDto<PlantEquipmentData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.PlantEquipment);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/business-interruption
        [HttpPost("business-interruption")]
        public async Task<IActionResult> CreateBusinessInterruption([FromBody] CreateAssetDto<BusinessInterruptionData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.BusinessInterruption);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/keyman
        [HttpPost("keyman")]
        public async Task<IActionResult> CreateKeyman([FromBody] CreateAssetDto<KeymanData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.KeymanInsurance);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // POST api/assets/electronic-equipment
        [HttpPost("electronic-equipment")]
        public async Task<IActionResult> CreateElectronicEquipment([FromBody] CreateAssetDto<ElectronicEquipmentData> dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _assetService.CreateAsync(dto, AssetType.ElectronicEquipment);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // PUT api/assets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAssetDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _assetService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE api/assets/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _assetService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
