using BuyOrWait.Application.Finances;
using BuyOrWait.Infrastructure.Persistence;
using BuyOrWait.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;


namespace BuyOrWait.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
   public class FinanceController : APIControllerBase
    {
        private readonly AppDbContext _db;
        public FinanceController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("settings")]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _db.UserSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);
            if(settings is null)
            {
                return Ok(new SettingsDto(0m, 0m));
            }
            return Ok(new SettingsDto(settings.CurrentBalance, settings.MinimumBalance));
        }
        [HttpPut("settings")]
        public async Task<IActionResult> UpdateSettings(SettingsDto dto)
        {
            var settings=await _db.UserSettings.FirstOrDefaultAsync(s=>s.UserId==CurrentUserId);
            if (settings is null)
            {
                settings = new UserSettings { UserId = CurrentUserId };
                _db.UserSettings.Add(settings);

            }
            settings.CurrentBalance = dto.CurrentBalance;
            settings.MinimumBalance=dto.MinimumBalance;

            await _db.SaveChangesAsync();
            return Ok(new SettingsDto(settings.CurrentBalance, settings.MinimumBalance));
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions()
        {
            var items = await _db.Transactions
                                  .Where(t=>t.UserId== CurrentUserId)
                                  .OrderByDescending(t=> t.Date)
                                  .Select(t => new TransactionDto(t.Id, t.Description, t.Amount, t.Date, t.IsRecurring))
                                  .ToListAsync();
            return Ok(items);

        }

        [HttpPost("transactions")]
        public async Task<IActionResult> AddTransaction(TransactionInput input)
        {
            var tx = new Transaction
            {
                UserId = CurrentUserId,
                Description = input.Description,
                Amount = input.Amount,
                Date = input.Date,
                IsRecurring = input.IsRecurring
            };
            _db.Transactions.Add(tx);
            await _db.SaveChangesAsync();
            var dto = new TransactionDto(tx.Id, tx.Description, tx.Amount, tx.Date, tx.IsRecurring);
            return CreatedAtAction(nameof(GetTransactions), new { id = tx.Id }, dto);
        }

        [HttpPut("transactions/{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, TransactionInput input)
        {
            var tx = await _db.Transactions.FirstOrDefaultAsync(t => t.UserId == CurrentUserId && t.Id == id);
            if(tx is null) return NotFound();
            tx.Description = input.Description;
            tx.Amount = input.Amount;
            tx.Date = input.Date;
            tx.IsRecurring = input.IsRecurring;

            await _db.SaveChangesAsync();
            return Ok(new TransactionDto(tx.Id, tx.Description, tx.Amount, tx.Date, tx.IsRecurring));

        }
        [HttpDelete("transactions/{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var tx= await _db.Transactions.FirstOrDefaultAsync(t=>t.Id==id && t.UserId==CurrentUserId );
            if(tx is null) return NotFound();
            _db.Transactions.Remove(tx);
            await _db.SaveChangesAsync();
            return NoContent();
        }

    }
}
