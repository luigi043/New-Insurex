using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using InsureX.Application.DTOs;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClaimsController : ControllerBase
    {
        private readonly IClaimService _claimService;

        public ClaimsController(IClaimService claimService)
        {
            _claimService = claimService;
        }

        // GET api/claims?policyId=1&status=Pending&page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? policyId,
            [FromQuery] ClaimStatus? status,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var result = await _claimService.GetPagedAsync(policyId, status, search, page, pageSize);
            return Ok(result);
        }

        // GET api/claims/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var claim = await _claimService.GetByIdAsync(id);
            if (claim == null) return NotFound();
            return Ok(claim);
        }

        // POST api/claims
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClaimDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _claimService.CreateAsync(dto, User.Identity!.Name!);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT api/claims/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClaimDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _claimService.UpdateAsync(id, dto, User.Identity!.Name!);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // POST api/claims/5/approve
        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Approve(int id, [FromBody] ApproveClaimDto dto)
        {
            var result = await _claimService.ApproveAsync(id, dto, User.Identity!.Name!);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST api/claims/5/reject
        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectClaimDto dto)
        {
            var result = await _claimService.RejectAsync(id, dto, User.Identity!.Name!);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST api/claims/5/pay
        [HttpPost("{id}/pay")]
        [Authorize(Roles = "Admin,Finance")]
        public async Task<IActionResult> Pay(int id, [FromBody] PayClaimDto dto)
        {
            var result = await _claimService.PayAsync(id, dto, User.Identity!.Name!);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST api/claims/5/documents
        [HttpPost("{id}/documents")]
        [RequestSizeLimit(10_485_760)] // 10 MB
        public async Task<IActionResult> UploadDocument(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided.");

            var allowedTypes = new[] { "application/pdf", "image/jpeg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType))
                return BadRequest("Unsupported file type.");

            using var stream = file.OpenReadStream();
            var doc = await _claimService.AddDocumentAsync(id, file.FileName, file.ContentType, stream);
            if (doc == null) return NotFound();
            return Ok(doc);
        }

        // DELETE api/claims/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _claimService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET api/claims/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _claimService.GetStatsAsync();
            return Ok(stats);
        }
    }
}
