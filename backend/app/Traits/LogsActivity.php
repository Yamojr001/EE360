<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            self::logAction($model, 'created');
        });

        static::updated(function ($model) {
            self::logAction($model, 'updated');
        });

        static::deleted(function ($model) {
            self::logAction($model, 'deleted');
        });
    }

    protected static function logAction($model, $action)
    {
        try {
            if (Auth::check()) {
                $user = Auth::user();
                $modelName = class_basename($model);
                
                $details = $model->toArray();
                $summary = self::formatModelSummary($modelName, $model, $action, $user);

                ActivityLog::create([
                    'user_id' => $user->id,
                    'action' => $action,
                    'description' => $summary,
                    'details' => $details,
                    'model_type' => get_class($model),
                    'model_id' => $model->id ?? null,
                ]);
            }
        } catch (\Throwable $e) {
            // Silently fail logging if error to avoid blocking main workflow
            \Illuminate\Support\Facades\Log::error('Activity logging failed: ' . $e->getMessage());
        }
    }

    protected static function formatModelSummary($modelName, $model, $action, $user)
    {
        $userName = $user->name;
        $roleName = ucwords(str_replace('_', ' ', $user->role ?? 'User'));
        
        switch ($modelName) {
            case 'WaterProduction':
                $qty = $model->bags_produced ?? 0;
                $waste = $model->waste ?? 0;
                $date = $model->date ? (is_string($model->date) ? $model->date : $model->date->format('Y-m-d')) : 'N/A';
                $notes = $model->notes ? " | Reason/Notes: {$model->notes}" : "";
                return "{$userName} ({$roleName}) {$action} Water Production batch of {$qty} bags (Waste: {$waste}) on {$date}{$notes}";
            
            case 'WaterSale':
                $qty = $model->quantity ?? 0;
                $buyer = $model->buyer ?: 'Customer';
                $total = is_numeric($model->total_amount) ? number_format((float)$model->total_amount, 2) : $model->total_amount;
                $method = $model->payment_method ? " [Payment: " . strtoupper($model->payment_method) . "]" : "";
                return "{$userName} ({$roleName}) {$action} Water Sale: {$qty} bags to {$buyer} for ₦{$total}{$method}";
            
            case 'WaterExpense':
            case 'Expense':
                $desc = $model->description ?? 'Expense item';
                $amount = is_numeric($model->amount) ? number_format((float)$model->amount, 2) : $model->amount;
                $vendor = $model->vendor ? " (Vendor: {$model->vendor})" : "";
                return "{$userName} ({$roleName}) {$action} Expense: ₦{$amount} for '{$desc}'{$vendor}";
            
            case 'FarmProduction':
                $item = $model->product_name ?? 'Farm yield';
                $qty = $model->quantity ?? 0;
                $unit = $model->unit ?? 'units';
                return "{$userName} ({$roleName}) {$action} Farm Production record: {$qty} {$unit} of {$item}";

            case 'Sale':
                $item = $model->item_type ?? 'Farm Item';
                $qty = $model->quantity ?? 0;
                $buyer = $model->buyer ?: 'Customer';
                $total = is_numeric($model->total_amount) ? number_format((float)$model->total_amount, 2) : $model->total_amount;
                return "{$userName} ({$roleName}) {$action} Farm Sale: {$qty}x {$item} to {$buyer} for ₦{$total}";

            case 'Animal':
                $type = $model->type ?? 'Animal';
                $tag = $model->tag_number ? " (Tag: {$model->tag_number})" : "";
                $val = $model->current_value ? " (Value: ₦" . number_format((float)$model->current_value, 2) . ")" : "";
                return "{$userName} ({$roleName}) {$action} Livestock Animal: {$type}{$tag}{$val}";

            case 'Customer':
                $name = $model->name ?? 'Customer';
                $phone = $model->phone ? " (Phone: {$model->phone})" : "";
                $addr = $model->address ? " (Address: {$model->address})" : "";
                return "{$userName} ({$roleName}) {$action} Customer record: {$name}{$phone}{$addr}";

            case 'Incident':
                $title = $model->title ?? 'Incident';
                $sev = $model->severity ? " [Severity: " . ucfirst($model->severity) . "]" : "";
                return "{$userName} ({$roleName}) {$action} Incident Report: '{$title}'{$sev}";

            case 'InventoryItem':
                $name = $model->name ?? 'Item';
                $qty = $model->quantity ?? 0;
                $unit = $model->unit ?? 'units';
                return "{$userName} ({$roleName}) {$action} Inventory Item: '{$name}' ({$qty} {$unit})";

            case 'Vendor':
                $name = $model->name ?? 'Vendor';
                $type = $model->type ? " ({$model->type})" : "";
                return "{$userName} ({$roleName}) {$action} Vendor contact: {$name}{$type}";

            case 'HatcheryRecord':
                $batch = $model->batch_number ?? $model->batch_name ?? 'Hatchery Batch';
                $type = $model->hatch_type ? " [" . ucfirst($model->hatch_type) . "]" : "";
                $provider = ($model->hatch_type === 'external' && $model->external_provider) ? " via {$model->external_provider}" : "";
                $set = $model->eggs_set ?? 0;
                return "{$userName} ({$roleName}) {$action} Hatchery record{$type}: '{$batch}' ({$set} eggs set){$provider}";

            case 'Worker':
                $name = $model->name ?? 'Staff member';
                $role = $model->role ?? $model->job_title ?? '';
                $roleStr = $role ? " ({$role})" : "";
                return "{$userName} ({$roleName}) {$action} Staff directory record: {$name}{$roleStr}";

            default:
                $readable = ucwords(strtolower(preg_replace('/(?<!^)[A-Z]/', ' $0', $modelName)));
                return "{$userName} ({$roleName}) {$action} {$readable} record #" . ($model->id ?? '');
        }
    }
}
