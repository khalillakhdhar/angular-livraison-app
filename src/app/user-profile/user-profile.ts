import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h2>User Profile</h2>
      </div>
      <div class="profile-content">
        <p>User information goes here</p>
      </div>
    </div>
  `,
  styleUrl: './user-profile.scss'
})
export class UserProfileComponent {
}