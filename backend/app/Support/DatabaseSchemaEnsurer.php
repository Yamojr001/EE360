<?php

namespace App\Support;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Log;

class DatabaseSchemaEnsurer
{
    private static bool $ensured = false;

    public static function ensureAll(): void
    {
        if (self::$ensured) {
            return;
        }

        self::ensureSaleColumns();
        self::ensureWaterSaleColumns();
        self::ensureWaterProductionColumns();
        self::ensureHatcheryColumns();
        self::ensureCustomerColumns();

        self::$ensured = true;
    }

    public static function ensureSaleColumns(): void
    {
        try {
            if (!Schema::hasTable('sales')) {
                return;
            }

            Schema::table('sales', function (Blueprint $table) {
                if (!Schema::hasColumn('sales', 'payment_method')) {
                    $table->string('payment_method')->nullable()->default('Cash')->after('buyer');
                }
                if (!Schema::hasColumn('sales', 'amount_paid')) {
                    $table->decimal('amount_paid', 12, 2)->nullable()->after('total_amount');
                }
                if (!Schema::hasColumn('sales', 'payment_status')) {
                    $table->string('payment_status')->default('paid')->after('amount_paid');
                }
                if (!Schema::hasColumn('sales', 'customer_id')) {
                    $table->unsignedBigInteger('customer_id')->nullable()->after('buyer');
                }
                if (!Schema::hasColumn('sales', 'sector_id')) {
                    $table->unsignedBigInteger('sector_id')->nullable()->default(1);
                }
                if (!Schema::hasColumn('sales', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        } catch (\Throwable $e) {
            Log::warning('DatabaseSchemaEnsurer::ensureSaleColumns warning: ' . $e->getMessage());
        }
    }

    public static function ensureWaterSaleColumns(): void
    {
        try {
            if (!Schema::hasTable('water_sales')) {
                return;
            }

            Schema::table('water_sales', function (Blueprint $table) {
                if (!Schema::hasColumn('water_sales', 'payment_method')) {
                    $table->string('payment_method')->nullable()->default('Cash');
                }
                if (!Schema::hasColumn('water_sales', 'payment_status')) {
                    $table->string('payment_status')->default('paid');
                }
                if (!Schema::hasColumn('water_sales', 'amount_paid')) {
                    $table->decimal('amount_paid', 12, 2)->nullable();
                }
                if (!Schema::hasColumn('water_sales', 'customer_id')) {
                    $table->unsignedBigInteger('customer_id')->nullable();
                }
                if (!Schema::hasColumn('water_sales', 'sector_id')) {
                    $table->unsignedBigInteger('sector_id')->nullable()->default(2);
                }
                if (!Schema::hasColumn('water_sales', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        } catch (\Throwable $e) {
            Log::warning('DatabaseSchemaEnsurer::ensureWaterSaleColumns warning: ' . $e->getMessage());
        }
    }

    public static function ensureWaterProductionColumns(): void
    {
        try {
            if (!Schema::hasTable('water_productions')) {
                return;
            }

            Schema::table('water_productions', function (Blueprint $table) {
                if (!Schema::hasColumn('water_productions', 'price_per_bag')) {
                    $table->decimal('price_per_bag', 10, 2)->nullable()->default(0);
                }
                if (!Schema::hasColumn('water_productions', 'bags_wasted')) {
                    $table->integer('bags_wasted')->nullable()->default(0);
                }
                if (!Schema::hasColumn('water_productions', 'waste_reason')) {
                    $table->string('waste_reason', 255)->nullable();
                }
                if (!Schema::hasColumn('water_productions', 'product_type')) {
                    $table->string('product_type', 50)->nullable()->default('sachet');
                }
                if (!Schema::hasColumn('water_productions', 'unit')) {
                    $table->string('unit', 50)->nullable()->default('bags');
                }
                if (!Schema::hasColumn('water_productions', 'sector_id')) {
                    $table->unsignedBigInteger('sector_id')->nullable()->default(2);
                }
                if (!Schema::hasColumn('water_productions', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        } catch (\Throwable $e) {
            Log::warning('DatabaseSchemaEnsurer::ensureWaterProductionColumns warning: ' . $e->getMessage());
        }
    }

    public static function ensureHatcheryColumns(): void
    {
        try {
            if (!Schema::hasTable('hatchery_records')) {
                return;
            }

            Schema::table('hatchery_records', function (Blueprint $table) {
                if (!Schema::hasColumn('hatchery_records', 'hatch_type')) {
                    $table->string('hatch_type', 20)->default('internal');
                }
                if (!Schema::hasColumn('hatchery_records', 'external_provider')) {
                    $table->string('external_provider', 255)->nullable();
                }
                if (!Schema::hasColumn('hatchery_records', 'external_contact')) {
                    $table->string('external_contact', 100)->nullable();
                }
                if (!Schema::hasColumn('hatchery_records', 'cost')) {
                    $table->decimal('cost', 12, 2)->nullable()->default(0.00);
                }
                if (!Schema::hasColumn('hatchery_records', 'sector_id')) {
                    $table->unsignedBigInteger('sector_id')->nullable()->default(1);
                }
                if (!Schema::hasColumn('hatchery_records', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        } catch (\Throwable $e) {
            Log::warning('DatabaseSchemaEnsurer::ensureHatcheryColumns warning: ' . $e->getMessage());
        }
    }

    public static function ensureCustomerColumns(): void
    {
        try {
            if (!Schema::hasTable('customers')) {
                return;
            }

            Schema::table('customers', function (Blueprint $table) {
                if (!Schema::hasColumn('customers', 'address')) {
                    $table->string('address', 255)->nullable();
                }
                if (!Schema::hasColumn('customers', 'phone')) {
                    $table->string('phone', 100)->nullable();
                }
                if (!Schema::hasColumn('customers', 'sector_id')) {
                    $table->unsignedBigInteger('sector_id')->nullable()->default(1);
                }
                if (!Schema::hasColumn('customers', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        } catch (\Throwable $e) {
            Log::warning('DatabaseSchemaEnsurer::ensureCustomerColumns warning: ' . $e->getMessage());
        }
    }

    /**
     * Filter data array so only existing table columns are included for create/update queries.
     */
    public static function filterData(string $tableName, array $data): array
    {
        try {
            if (!Schema::hasTable($tableName)) {
                return $data;
            }
            $existingColumns = Schema::getColumnListing($tableName);
            return array_intersect_key($data, array_flip($existingColumns));
        } catch (\Throwable $e) {
            return $data;
        }
    }
}
