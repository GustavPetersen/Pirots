namespace backend.controllers;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using backend.dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using backend.data;

/// <summary>
/// Controller for auth requests
/// </summary>
[ApiController]
[Route("auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly AppDbContext _dbContext;

    /// <summary>
    /// ...
    /// </summary>
    public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <param name="req"> ... </param>
    /// <returns> ... </returns>
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var result = await _signInManager.PasswordSignInAsync(
            req.UserName, req.Password, req.RememberMe, lockoutOnFailure: true
        );
        return result.Succeeded ? Ok() : Unauthorized();
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <returns> ... </returns>
    [Authorize]
    [HttpPost]
    [Route("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <param name="req"> ... </param>
    /// <returns> ... </returns>
    [HttpPost]
    [Route("signup")]
    public async Task<IActionResult> SignUp(SignUpRequest req)
    {
        AppUser newUser = new()
        {
            UserName = req.UserName,
            Wallet = new Wallet()
        };

        var result = await _userManager.CreateAsync(newUser, req.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        return Ok();
    }

    /// <summary>
    /// ...
    /// </summary>
    /// <returns> ... </returns>
    [Authorize]
    [HttpGet]
    [Route("me")]
    public async Task<IActionResult> Me()
    {
        string? userId = _userManager.GetUserId(User);
        MeResult? me = await _dbContext.Users
            .Where(u => u.Id == userId)
            .Select(u => new MeResult(u.UserName!, u.Wallet.Amount))
            .SingleOrDefaultAsync();

        if (me is null)
        {
            await _signInManager.SignOutAsync(); // Invalidate the session
            return Unauthorized();
        }

        return Ok(me);
    }
}
